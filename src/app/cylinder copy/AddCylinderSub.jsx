import React, { useContext, useEffect, useState } from "react";
import { Button, TextField, MenuItem } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowRight, FaCheck, FaTimes } from "react-icons/fa";
import Layout from "../../layout/Layout";
import { ContextPanel } from "../../utils/ContextPanel";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import toast, { Toaster } from "react-hot-toast";
import { IoIosQrScanner } from "react-icons/io";
import { Dialog, DialogBody, DialogFooter } from "@material-tailwind/react";
import ScannerModel from "../../components/ScannerModel";
import Select from "react-select";

const month = [
  {
    value: "01",
    label: "01",
  },
  {
    value: "02",
    label: "02",
  },
  {
    value: "03",
    label: "03",
  },
  {
    value: "04",
    label: "04",
  },
  {
    value: "05",
    label: "05",
  },
  {
    value: "06",
    label: "06",
  },
  {
    value: "07",
    label: "07",
  },
  {
    value: "08",
    label: "08",
  },
  {
    value: "09",
    label: "09",
  },
  {
    value: "10",
    label: "10",
  },
  {
    value: "11",
    label: "11",
  },
  {
    value: "12",
    label: "12",
  },
];

const AddCylinderSub = () => {
  // web-create-cylinder-sub , tofetch manufacture - web-fetch-manufacturer
  const [cylinder, setCylinder] = useState({
    cylinder_sub_barcode: "",
    cylinder_sub_company_no: "",
    cylinder_sub_manufacturer_id: "",
    cylinder_sub_manufacturer_id_new: "",
    cylinder_sub_manufacturer_month: "",
    cylinder_sub_manufacturer_year: "",
    cylinder_sub_batch_no: "",
    cylinder_sub_weight: "",
    cylinder_sub_previous_test_date: "",
    cylinder_sub_n_t_d: "",
    cylinder_sub_n_weight: "",
  });
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();
  const { id } = useParams();

  const [manufacturer, setManufacturer] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [userTypeId, setUserTypeId] = useState("");
  //
  const [showmodal, setShowmodal] = useState(false);
  //
  useEffect(() => {
    setBranchId(localStorage.getItem("branchId"));
    setUserTypeId(localStorage.getItem("userTypeId"));
  }, []);

  const closegroupModal = () => {
    setShowmodal(false);
  };

  const openmodal = () => {
    setShowmodal(true);
  };

  const barcodeScannerValue = (value) => {
    setCylinder({
      ...cylinder,
      cylinder_sub_barcode: value,
    });

    setShowmodal(false);
    // setId(value);
    // checkBarcode(value);
  };

  useEffect(() => {
    const fetchManufactureData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-manufacturer`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setManufacturer(response.data.manufacturer);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchManufactureData();
    setLoading(false);
  }, []);

  const onInputChange = (e) => {
    setCylinder({ ...cylinder, [e.target.name]: e.target.value });
  };

  //

  const manufacturerOptions = manufacturer.map((c_manufacturer) => ({
    value: c_manufacturer.id,
    label: c_manufacturer.manufacturer_name,
  }));

  const handleManufacturerChange = (selectedOption) => {
    setCylinder({
      ...cylinder,
      cylinder_sub_manufacturer_id: selectedOption ? selectedOption.value : "",
      cylinder_sub_manufacturer_id_new: "",
    });
  };

  //

  const onSubmitNext = async (e) => {
    e.preventDefault();

    const form = document.getElementById("addIndiv");
    if (!form.checkValidity()) {
      toast.error("Fill the required Filed");
      return;
    }
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    setLoading(true);
    try {
      let dataNext = {};
      if (branchId === "1" && userTypeId === "2") {
        dataNext = {
          id: id,
          cylinder_sub_barcode: cylinder.cylinder_sub_barcode,
          cylinder_sub_batch_no: cylinder.cylinder_sub_batch_no,
          cylinder_sub_company_no: cylinder.cylinder_sub_company_no,
          cylinder_sub_manufacturer_id: cylinder.cylinder_sub_manufacturer_id,
          cylinder_sub_manufacturer_id_new:
            cylinder.cylinder_sub_manufacturer_id_new,
          cylinder_sub_manufacturer_month:
            cylinder.cylinder_sub_manufacturer_month,
          cylinder_sub_manufacturer_year:
            cylinder.cylinder_sub_manufacturer_year,
          cylinder_sub_weight: cylinder.cylinder_sub_weight,
        };
      } else if (branchId === "2" && userTypeId === "2") {
        dataNext = {
          id: id,
          cylinder_sub_barcode: cylinder.cylinder_sub_barcode,
          cylinder_sub_batch_no: cylinder.cylinder_sub_batch_no,
          cylinder_sub_company_no: cylinder.cylinder_sub_company_no,
          cylinder_sub_manufacturer_id: cylinder.cylinder_sub_manufacturer_id,
          cylinder_sub_manufacturer_id_new:
            cylinder.cylinder_sub_manufacturer_id_new,
          cylinder_sub_manufacturer_month:
            cylinder.cylinder_sub_manufacturer_month,
          cylinder_sub_manufacturer_year:
            cylinder.cylinder_sub_manufacturer_year,
          cylinder_sub_weight: cylinder.cylinder_sub_weight,
          cylinder_sub_previous_test_date:
            cylinder.cylinder_sub_previous_test_date,
          cylinder_sub_n_t_d: cylinder.cylinder_sub_n_t_d,
          cylinder_sub_n_weight: cylinder.cylinder_sub_n_weight,
        };
      }

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/web-create-cylinder-sub`,
        dataNext,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.code == "200") {
        toast.success("sub cylinder details Added ");
        navigate(`/add-sub-cylinder/${id}`);
        setCylinder({
          cylinder_sub_barcode: "",
          cylinder_sub_company_no: "",
          cylinder_sub_manufacturer_id: "",
          cylinder_sub_manufacturer_id_new: "",
          cylinder_sub_manufacturer_month: "",
          cylinder_sub_manufacturer_year: "",
          cylinder_sub_batch_no: "",
          cylinder_sub_weight: "",
          cylinder_sub_previous_test_date: "",
          cylinder_sub_n_t_d: "",
          cylinder_sub_n_weight: "",
        });
      } else {
        toast.error("Duplicate Entry");
      }
    } catch (error) {
      console.error("Error creating Sumbit and Next add sub cylinder", error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = document.getElementById("addIndiv");

    if (!form.checkValidity()) {
      toast.error("Fill the required Filed");
      return;
    }
    if (!isPanelUp) {
      navigate("/maintenance");
      return;
    }
    setLoading(true);
    try {
      let dataSub = {};
      if (branchId === "1" && userTypeId === "2") {
        dataSub = {
          id: id,
          cylinder_sub_barcode: cylinder.cylinder_sub_barcode,
          cylinder_sub_batch_no: cylinder.cylinder_sub_batch_no,
          cylinder_sub_company_no: cylinder.cylinder_sub_company_no,
          cylinder_sub_manufacturer_id: cylinder.cylinder_sub_manufacturer_id,
          cylinder_sub_manufacturer_id_new:
            cylinder.cylinder_sub_manufacturer_id_new,
          cylinder_sub_manufacturer_month:
            cylinder.cylinder_sub_manufacturer_month,
          cylinder_sub_manufacturer_year:
            cylinder.cylinder_sub_manufacturer_year,
          cylinder_sub_weight: cylinder.cylinder_sub_weight,
        };
      } else if (branchId === "2" && userTypeId === "2") {
        dataSub = {
          id: id,
          cylinder_sub_barcode: cylinder.cylinder_sub_barcode,
          cylinder_sub_batch_no: cylinder.cylinder_sub_batch_no,
          cylinder_sub_company_no: cylinder.cylinder_sub_company_no,
          cylinder_sub_manufacturer_id: cylinder.cylinder_sub_manufacturer_id,
          cylinder_sub_manufacturer_id_new:
            cylinder.cylinder_sub_manufacturer_id_new,
          cylinder_sub_manufacturer_month:
            cylinder.cylinder_sub_manufacturer_month,
          cylinder_sub_manufacturer_year:
            cylinder.cylinder_sub_manufacturer_year,
          cylinder_sub_weight: cylinder.cylinder_sub_weight,
          cylinder_sub_previous_test_date:
            cylinder.cylinder_sub_previous_test_date,
          cylinder_sub_n_t_d: cylinder.cylinder_sub_n_t_d,
          cylinder_sub_n_weight: cylinder.cylinder_sub_n_weight,
        };
      }

      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${BASE_URL}/api/web-create-cylinder-sub`,
        dataSub,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.code == "200") {
        toast.success("sub Cylinder Details Added");
        navigate("/cylinder");
      } else {
        toast.error("Duplicate Entry");
      }
    } catch (error) {
      console.error("Error creating Add Sub Cylinder", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (
      e.key !== "Backspace" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight" &&
      e.key !== "ArrowUp" &&
      e.key !== "ArrowDown" &&
      e.key !== "Tab" &&
      e.key !== "Enter" &&
      !e.key.match(/[0-9]/)
    ) {
      e.preventDefault();
    }
  };

  const handleTareDown = (e) => {
    if (
      !(
        (e.key >= "0" && e.key <= "9") ||
        e.key === "." ||
        e.key === "Backspace" ||
        e.key === "Delete" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight"
      )
    ) {
      e.preventDefault();
    }

    if (e.key === "." && e.target.value.includes(".")) {
      e.preventDefault();
    }
  };
  const customStyles = {
    control: (provided) => ({
      ...provided,
      height: "55px",
      minHeight: "55px",
      fontSize: "1rem",
      borderRadius: "0.2rem",
      borderColor: "#2196F3",
    }),
    menu: (provided) => ({
      ...provided,
      fontSize: "1rem",
      zIndex:10
    }),
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
      <div className="p-4 md:p-6">
        <div className="mb-4">
          <h3 className="text-xl md:text-2xl font-bold">Add Sub Cylinder</h3>
        </div>
        <div className="bg-white p-4 md:p-6 shadow rounded-md">
          <form id="addIndiv" autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* serial no  */}

              {branchId === "1" && userTypeId === "2" && (
                <>
                  <div className=" flex mb-4">
                    {branchId === "1" ? (
                      <IoIosQrScanner
                        className="mdi mdi-barcode-scan w-6 hover:text-red-500 h-12 mdi-48px menu-icon"
                        style={{ cursor: "pointer", marginRight: "1rem" }}
                        onClick={openmodal}
                      ></IoIosQrScanner>
                    ) : (
                      ""
                    )}
                    <TextField
                      id="select-corrpreffer"
                      required
                      label="R K Serial No"
                      inputProps={{
                        maxLength: 6,
                        minLength: 4,
                        pattern: "[0-9]{4,6}",
                      }}
                      onKeyDown={handleKeyDown}
                      name="cylinder_sub_barcode"
                      value={cylinder.cylinder_sub_barcode}
                      onChange={onInputChange}
                      fullWidth
                    />
                  </div>
                </>
              )}

              <div className="mb-4">
                <TextField
                  id="select-corrpreffer"
                  required
                  label="Cylinder No"
                  inputProps={{ maxLength: 10, minLength: 1 }}
                  name="cylinder_sub_company_no"
                  value={cylinder.cylinder_sub_company_no}
                  onChange={onInputChange}
                  onKeyDown={handleKeyDown}
                  fullWidth
                />
              </div>

              {/* Manufacturer  */}

              <div className="mb-4 lg:col-span-2 ">
                {cylinder.cylinder_sub_manufacturer_id != "1" &&
                  cylinder.cylinder_sub_manufacturer_id != "513" && (
                    <>
                      <Select
                        options={manufacturerOptions}
                        value={manufacturerOptions.find(
                          (option) =>
                            option.value ===
                            cylinder.cylinder_sub_manufacturer_id
                        )}
                        onChange={handleManufacturerChange}
                        placeholder="Select Manufacturer"
                        isSearchable={true}
                        name="cylinder_sub_manufacturer_id"
                        styles={customStyles}
                        required
                      />
                      {/* <div>
                       
                      <Select
                          name="cylinder_sub_manufacturer_id"
                          options={manufacturer.map((option) => ({
                            value: option.manufacturer_name,
                            label: option.manufacturer_name,
                            name: "cylinder_sub_manufacturer_id",
                          }))}
                          onChange={(e) => onInputChange(e)}
                          value={
                            cylinder.cylinder_sub_manufacturer_id
                              ? {
                                  value: cylinder.cylinder_sub_manufacturer_id,
                                  label: cylinder.cylinder_sub_manufacturer_id,
                                }
                              : null
                          }
                          placeholder="Select Manufacturer"
                          styles={customStyles}
                          isSearchable={true}
                        />
                      </div> */}
                      {/* <TextField
                    id="select-corrpreffer"
                    required
                    SelectProps={{ MenuProps: {} }}
                    select
                    label="Manufacturer"
                    name="cylinder_sub_manufacturer_id"
                    value={cylinder.cylinder_sub_manufacturer_id}
                    onChange={onInputChange}
                    fullWidth
                  >
                    {manufacturer.map((c_manufacturer, key) => (
                      <MenuItem key={key} value={c_manufacturer.id}>
                        {c_manufacturer.manufacturer_name}
                      </MenuItem>
                    ))}
                  </TextField> */}
                    </>
                  )}
                {(cylinder.cylinder_sub_manufacturer_id == "1" ||
                  cylinder.cylinder_sub_manufacturer_id == "513") && (
                  <TextField
                    label="Manufacturer"
                    required
                    name="cylinder_sub_manufacturer_id_new"
                    value={cylinder.cylinder_sub_manufacturer_id_new}
                    onChange={onInputChange}
                    fullWidth
                  />
                )}
              </div>

              <div className="mb-4">
                <TextField
                  id="select-corrpreffer"
                  required
                  SelectProps={{ MenuProps: {} }}
                  select
                  label="Month"
                  name="cylinder_sub_manufacturer_month"
                  value={cylinder.cylinder_sub_manufacturer_month}
                  onChange={onInputChange}
                  fullWidth
                >
                  {month.map((c_month, key) => (
                    <MenuItem key={key} value={c_month.value}>
                      {c_month.label}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="mb-4">
                <TextField
                  id="select-corrpreffer"
                  required
                  inputProps={{ maxLength: 2, minLength: 2 }}
                  label="Year"
                  onKeyDown={handleKeyDown}
                  name="cylinder_sub_manufacturer_year"
                  value={cylinder.cylinder_sub_manufacturer_year}
                  onChange={onInputChange}
                  fullWidth
                />
              </div>
              <div className="mb-4">
                <TextField
                  id="select-corrpreffer"
                  required
                  label="Batch No"
                  // onKeyDown={handleKeyDown}
                  name="cylinder_sub_batch_no"
                  value={cylinder.cylinder_sub_batch_no}
                  onChange={onInputChange}
                  fullWidth
                />
              </div>
              <div className="mb-4">
                <TextField
                  id="select-corrpreffer"
                  required
                  label={branchId == "2" ? "Old Tare Weight" : "Tare Weight"}
                  name="cylinder_sub_weight"
                  inputProps={{ maxLength: 5, pattern: "[0-9]*\\.?[0-9]*" }}
                  value={cylinder.cylinder_sub_weight}
                  onChange={onInputChange}
                  onKeyDown={handleTareDown}
                  fullWidth
                />
              </div>
              {/* from here it is only for branch 2  */}
              {branchId === "2" && userTypeId === "2" && (
                <>
                  {/* <div className="mb-4">
                    <TextField
                      id="select-corrpreffer"
                      required
                      label="Previous Test Date"
                      name="cylinder_sub_previous_test_date"
                      inputProps={{ maxLength: 5 }}
                      value={cylinder.cylinder_sub_previous_test_date}
                      onChange={onInputChange}
                      fullWidth
                    />
                  </div>
                  <div className="mb-4">
                    <TextField
                      id="select-corrpreffer"
                      required
                      label="Next Test Date"
                      name="cylinder_sub_n_t_d"
                      inputProps={{ maxLength: 5 }}
                      value={cylinder.cylinder_sub_n_t_d}
                      onChange={onInputChange}
                      fullWidth
                    />
                  </div> */}
                  <div className="mb-4">
                    <TextField
                      id="select-corrpreffer"
                      required
                      label="New Tare Weight(Kg)"
                      name="cylinder_sub_n_weight"
                      inputProps={{ maxLength: 5 }}
                      value={cylinder.cylinder_sub_n_weight}
                      onChange={onInputChange}
                      fullWidth
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mt-4">
              <Button
                type="submit"
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full md:w-auto"
                onClick={onSubmitNext}
                disabled={loading}
              >
                {loading ? (
                  "Submit & Next..."
                ) : (
                  <>
                    <FaArrowRight className="mr-2" />
                    Submit & Next
                  </>
                )}
              </Button>
              <Button
                type="submit"
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full md:w-auto"
                onClick={onSubmit}
                disabled={loading}
              >
                {loading ? (
                  "Finishing..."
                ) : (
                  <>
                    <FaCheck className="mr-2" />
                    Finish
                  </>
                )}
              </Button>
              <Link to="/cylinder">
                <Button className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 w-full md:w-auto">
                  <FaTimes className="mr-2" />
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
        {/* Modal for barcode scanner */}
        <Dialog open={showmodal} handler={closegroupModal} size="lg">
          <DialogBody className="h-[60vh] md:h-[75vh] lg:h-[85vh] p-4 flex justify-center">
            <ScannerModel barcodeScannerValue={barcodeScannerValue} />
          </DialogBody>
          <DialogFooter className="flex justify-between">
            <button
              onClick={closegroupModal}
              className="px-4 py-2 bg-red-500 text-white rounded-md cursor-pointer"
            >
              Close
            </button>
          </DialogFooter>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AddCylinderSub;
