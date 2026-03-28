import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "@mui/material";
import { FaEdit, FaArrowLeft } from "react-icons/fa";
import Moment from "moment";

import Layout from "../../layout/Layout";
import { ContextPanel } from "../../utils/ContextPanel";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import MUIDataTable from "mui-datatables";
import { toast } from "react-toastify";
import { IoReturnDownBack } from "react-icons/io5";

const CylView = () => {
  const { id } = useParams();

  const [cylinders, setCylinders] = useState({
    cylinder_date: "",
    cylinder_batch_nos: "",
  });

  const [vendor, setVendor] = useState({
    vendor_name: "",
  });

  const [cylindersSub, setCylindersSub] = useState([
    {
      cylinder_sub_barcode: "",
      cylinder_sub_company_no: "",
      manufacturer_name: "",
      cylinder_sub_manufacturer_month: "",
      cylinder_sub_manufacturer_year: "",
      cylinder_sub_batch_no: "",
      cylinder_sub_weight: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const branchId = Number(localStorage.getItem("branchId"));

  useEffect(() => {
    const fetchManuData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-cylinder-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCylindersSub(response.data.cylinderSub);
        setVendor(response.data.vendor);
        setCylinders(response.data.cylinder);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchManuData();
    setLoading(false);
  }, []);

  const downloadReport = async (url, fileName) => {
    let data = {
      cylinder_batch_nos: cylinders.cylinder_batch_nos,
    };
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        url,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const downloadUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      console.log(`${fileName} downloaded successfully.`);
      // toast.success("Member data Download");
    } catch (err) {
      console.error(`Error downloading ${fileName}:`, err);
      toast.error("Err on Downloading");
    }
  };

  const handlePrint = (e) => {
    e.preventDefault();
    downloadReport(`${BASE_URL}/api/download-cylinder-details-report-in-view`, "subcylinderview.csv");
    toast.success("Download SubCylinder view");
  };

  

  const columns = [
    ...(branchId === 1
      ? [
          {
            name: "cylinder_sub_barcode",
            label: "R K Serial No",
            options: {
              filter: true,
              sort: false,
            },
          },
        ]
      : []),
    {
      name: "cylinder_sub_company_no",
      label: "Cylinder No",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "manufacturer_name",
      label: "Manufacturer",
      options: {
        filter: true,
        sort: false,
      },
    },

    {
      name: "cylinder_sub_manufacturer_month",
      label: "Month/Year",
      options: {
        filter: true,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          let cylinder_sub_manufacturer_month;
      let cylinder_sub_manufacturer_year;

      if (branchId === 1) {
        cylinder_sub_manufacturer_month = tableMeta.rowData[3];
        cylinder_sub_manufacturer_year = tableMeta.rowData[4];
      } else {
        cylinder_sub_manufacturer_month = tableMeta.rowData[2];
        cylinder_sub_manufacturer_year = tableMeta.rowData[3];
      }
          return `${cylinder_sub_manufacturer_month}/${cylinder_sub_manufacturer_year}`;
        },
      },
    },
    {
      name: "cylinder_sub_manufacturer_year",
      label: "Year",
      options: {
        display: false,
      },
    },
    {
      name: "cylinder_sub_batch_no",
      label: "Batch No",
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: "cylinder_sub_weight",
      label: "Tare Weight",
      options: {
        filter: true,
        sort: false,
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
              <FaEdit
                onClick={() => navigate(`/cylinder-edit/${id}`)}
                title="Edit Sub Cylinder"
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
    print: false,
    download: false,
    search: true,
    filter: true,
    // pagination: false,
    responsive: "standard",
    viewColumns: false,
  };

  return (
    <Layout>
      <div className="p-4 sm:p-6">
        <div className="mb-6 flex  items-center justify-between gap-4">
       
          <h3 className="text-xl border-b-2 border-dashed border-blue-900 sm:text-2xl font-bold">View Cylinder</h3>
          <Link to="/cylinder">
                <button className="w-20 h-10  border border-red-500 hover:border-blue-500 bg-blue-400 hover:bg-red-100  p-1 rounded-lg text-white hover:text-red-700" >Go Back</button>
              </Link>
          
        </div>
        <div className="bg-white p-4 sm:p-6 shadow rounded-md">
          <div className=" flex  flex-col items-center md:flex-row lg:flex-row xl:flex-row justify-around gap-4 mb-4">
            <div className="flex items-center">
              <label className="font-bold">Date: </label>
              <span className="ml-2">
                {Moment(cylinders.cylinder_date).format("DD-MM-YYYY")}
              </span>
            </div>
            <div className="flex items-center">
              <label className="font-bold">R K Batch No: </label>
              <span className="ml-2">{cylinders.cylinder_batch_nos}</span>
            </div>
            <div className="flex items-center">
              <label className="font-bold">Vendor: </label>
              <span className="ml-2">{vendor.vendor_name}</span>
            </div>
            <div
              onClick={(e) => handlePrint(e)}
              className="btn btn-primary text-center w-36 md:text-right text-white bg-blue-600 hover:bg-green-700 px-4 py-2 rounded-lg shadow-md"
            >
              Download List
            </div>
          </div>

          <div className="mt-5">
            <MUIDataTable
              data={cylindersSub ? cylindersSub : []}
              columns={columns}
              options={options}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CylView;
