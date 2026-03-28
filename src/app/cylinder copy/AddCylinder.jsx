import { Button, TextField, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import Layout from "../../layout/Layout";
import { ContextPanel } from "../../utils/ContextPanel";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import toast, { Toaster } from "react-hot-toast";
import DateYear from "../../utils/DateYear";

const AddCylinder = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0");
  var yyyy = today.getFullYear();
  today = mm + "/" + dd + "/" + yyyy;
  var todayback = yyyy + "-" + mm + "-" + dd;
  const [cylinder, setCylinder] = useState({
    cylinder_year: DateYear,
    cylinder_date: todayback,
    cylinder_batch_nos: "",
    cylinder_vendor_id: "",
    cylinder_count: "0",
  });
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const [vendor, setVendor] = useState([]);
  const [batchid, setBatchid] = useState("");
  const navigate = useNavigate();
  const onInputChange = (e) => {
    setCylinder({ ...cylinder, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/web-fetch-vendor`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setVendor(response.data?.vendor);

        console.log;
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendor();
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchBatch = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/web-fetch-batch-no`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBatchid(
          isNaN(response.data.latestid?.cylinder_batch_nos)
            ? "101"
            : response.data.latestid?.cylinder_batch_nos + 1
        );

        console.log;
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBatch();
    setLoading(false);
  }, []);

  // for creating cylinder
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    setLoading(true);
    try {
      const data = {
        cylinder_year: DateYear,
        cylinder_date: cylinder.cylinder_date,
        cylinder_vendor_id: cylinder.cylinder_vendor_id,
        cylinder_count: "0",
        cylinder_batch_nos: batchid,
      };
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/web-create-cylinder`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.code == "200") {
        toast.success("Cylinder Add");
        navigate("/cylinder");
      } else {
        toast.error("Error");
      }
    } catch (error) {
      console.error("Error creating maufacturer", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Layout>
      <Toaster
        toastOptions={{
          success: {
            style: {
              background: "green",
            },
          },
          error: {
            style: {
              background: "red",
            },
          },
        }}
        position="top-right"
        reverseOrder={false}
      />
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-2xl font-bold">Add Cylinder</h3>
        </div>
        <div className="grid grid-cols-1">
          <div className="bg-white p-6 shadow rounded-md">
            <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-4">
                    <TextField
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                      type="date"
                      label="Date"
                      autoComplete="Name"
                      name="cylinder_date"
                      value={cylinder.cylinder_date}
                      onChange={onInputChange}
                    />
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <TextField
                      fullWidth
                      required
                      label="R K Batch No"
                      name="cylinder_batch_nos"
                      value={batchid}
                      onChange={(e) => setBatchid(e.target.value)}
                    />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="mb-4">
                    <TextField
                      fullWidth
                      required
                      label="Vendor"
                      name="cylinder_vendor_id"
                      select
                      value={cylinder.cylinder_vendor_id}
                      onChange={onInputChange}
                    >
                      {vendor.map((c_vendor, key) => (
                        <MenuItem key={key} value={c_vendor.id}>
                          {c_vendor.vendor_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  type="submit"
                  className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? (
                    "Submitting..."
                  ) : (
                    <>
                      <FaCheck className="mr-2" />
                      Submit
                    </>
                  )}
                </Button>
                <Link to="/cylinder">
                  <Button className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                    <FaTimes className="mr-2" />
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddCylinder;
