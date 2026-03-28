import React, { useContext, useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MUIDataTable from "mui-datatables";
import BASE_URL from "../../base/BaseUrl";
import { ContextPanel } from "../../utils/ContextPanel";
import { CiSquarePlus } from "react-icons/ci";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import Moment from "moment";

const Cylinder = () => {
  const [cylinderData, setCylinderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCylData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-cylinder-list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCylinderData(response.data.cylinder);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCylData();
    setLoading(false);
  }, []);

  const columns = [
    {
      name: "slNo",
      label: "SL No",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          return tableMeta.rowIndex + 1;
        },
      },
    },
    {
      name: "vendor_name",
      label: "Vendor",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "cylinder_count",
      label: "Cyl Count",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "cylinder_status",
      label: "Status",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "cylinder_batch_nos",
      label: "R K Batch no",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "cylinder_date",
      label: "Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => {
          return Moment(value).format("DD-MM-YYYY");
        },
      },
    },
    {
      name: "id",
      label: "Action",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (id) => {
          return (
            <div className="flex items-center space-x-2">
              <CiSquarePlus
                onClick={() => navigate(`/add-sub-cylinder/${id}`)}
                title="Add Cylinder Info"
                className="h-5 w-5 cursor-pointer"
              />
              <MdOutlineRemoveRedEye
                onClick={() => {
                  localStorage.setItem("viewedCylinderId", id);
                  navigate(`/cylinder-view/${id}`);
                }}
                title="View Cylinder Info"
                className="h-5 w-5 cursor-pointer"
              />
            </div>
          );
        },
      },
    },
  ];
  const options = {
    selectableRows: "none",
    elevation: 0,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 25],
    responsive: "standard",
    viewColumns: false,
    download: false,
    print: false,
  };
  return (
    <Layout>
      <div className="flex flex-col md:flex-row justify-between items-center bg-white mt-5 p-2 rounded-lg space-y-4 md:space-y-0">
        <h3 className="text-center md:text-left text-lg md:text-xl font-bold">
          Cylinder List
        </h3>

        <Link
          to="/add-cylinder"
          className="btn btn-primary text-center md:text-right text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md"
        >
          + Create
        </Link>
      </div>
      <div className="mt-5">
        <MUIDataTable
          data={cylinderData ? cylinderData : []}
          columns={columns}
          options={options}
        />
      </div>
    </Layout>
  );
};

export default Cylinder;
