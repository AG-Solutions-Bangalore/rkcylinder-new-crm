import { useState, useEffect, useContext } from "react";
import {
  useParams,
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { TextField, MenuItem, Button } from "@mui/material";
import { FiEdit } from "react-icons/fi";
import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import { ContextPanel } from "../../utils/ContextPanel";
import { toast } from "react-toastify";


const CylinderEdit = () => {
  const { id } = useParams(); // Get the main cylinder ID from URL params
  const [searchParams] = useSearchParams();
  const subId = searchParams.get("subId"); // Get the sub-cylinder ID from the query params

  const [subCylinder, setSubCylinder] = useState({
    cylinder_sub_barcode: "",
    cylinder_sub_company_no: "",
    cylinder_sub_manufacturer_id: "",
    cylinder_sub_manufacturer_month: "",
    cylinder_sub_manufacturer_year: "",
    cylinder_sub_batch_no: "",
    cylinder_sub_weight: "",
    cylinder_sub_status: "",
    cylinder_sub_previous_test_date: "",
    cylinder_sub_d_d: "",
    cylinder_sub_c_d: "",
    cylinder_sub_v_ii: "",
    cylinder_sub_v_ie: "",
    cylinder_sub_r_c: "",
    cylinder_sub_bung_check: "",
    cylinder_sub_h_t: "",
    cylinder_sub_p_p: "",
    cylinder_sub_p: "",
    cylinder_sub_n_weight: "",
    cylinder_sub_f_i: "",
    cylinder_sub_p_t: "",
    cylinder_sub_n_t_d: "",
  });

  const [manufacturer, setManufacturer] = useState([]);
  const [branchId, setBranchId] = useState("");
  const [userTypeId, setUserTypeId] = useState("");
  useEffect(() => {
    setBranchId(localStorage.getItem("branchId"));
    setUserTypeId(localStorage.getItem("userTypeId"));
  }, []);
  const [month, setMonth] = useState([
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ]);
  const [yesNo, setYesNo] = useState([{ value: "Yes" }, { value: "No" }]);
  const [aR, setAR] = useState([{ value: "Accepted" }, { value: "Rejected" }]);
  const [okRejected, setOkRejected] = useState([
    { value: "Ok" },
    { value: "Rejected" },
  ]);
  const [rtRRejected, setRtRRejected] = useState([
    { value: "RT" },
    { value: "Rejected" },
  ]);
  const [rejectCode, setRejectCode] = useState([
    { value: "Ok" },
    { value: "E1-Bulge" },
    { value: "E2-Burn" },
    { value: "E3-Dent" },
    { value: "E4-Dig" },
    { value: "E5-Cut " },
    { value: "E6-Pit " },
    { value: "E7-Line Corrosion" },
    { value: "E8-General Corrosion" },
    { value: "E9-Bung Thread Damaged" },
    { value: "E10-Lose in tare Weight" },
    { value: "E11- Identity Lost" },
    { value: "E12-Bottom Clearance less than Limits" },
    { value: "E13-Wall Thickness less than Limits" },
    { value: "I1-Internal Defect Cannot be Assessed" },
    { value: "Intersecting cut or gouge" },
    { value: "Dent Containing cut or gouge" },
    { value: "Crack" },
    { value: "lamination" },
    { value: "Bottom Shell Thickness Low" },
    { value: "Area Corrosion" },
    { value: "Crevice Corrosion" },
    { value: "Failed in Hydrotest" },
    { value: "Failed in Pneumatic Test" },
  ]);
  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubCylinderData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-cylinder-by-id-new/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSubCylinder(response.data.cylinderSub);
      } catch (error) {
        console.error("Error fetching cylinder data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubCylinderData();
  }, [id]);

  useEffect(() => {
    const fetchManu = async () => {
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
        console.error("Error fetching cylinder data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchManu();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSubCylinder((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = document.getElementById("addIndiv");

    if (!form.checkValidity()) {
      toast.error("Fill the required Filed");
      return;
    }
    try {
      let dataSubCyl = {};
      if (branchId === "1" && userTypeId === "2") {
        dataSubCyl = {
          cylinder_sub_barcode: subCylinder.cylinder_sub_barcode,
          cylinder_sub_company_no: subCylinder.cylinder_sub_company_no,
          cylinder_sub_manufacturer_id:
            subCylinder.cylinder_sub_manufacturer_id,
          cylinder_sub_manufacturer_month:
            subCylinder.cylinder_sub_manufacturer_month,
          cylinder_sub_manufacturer_year:
            subCylinder.cylinder_sub_manufacturer_year,
          cylinder_sub_batch_no: subCylinder.cylinder_sub_batch_no,
          cylinder_sub_weight: subCylinder.cylinder_sub_weight,
        };
      } else if (branchId === "2" && userTypeId === "2") {
        dataSubCyl = {
          cylinder_sub_barcode: subCylinder.cylinder_sub_barcode,
          cylinder_sub_company_no: subCylinder.cylinder_sub_company_no,
          cylinder_sub_manufacturer_id:
            subCylinder.cylinder_sub_manufacturer_id,
          cylinder_sub_manufacturer_month:
            subCylinder.cylinder_sub_manufacturer_month,
          cylinder_sub_manufacturer_year:
            subCylinder.cylinder_sub_manufacturer_year,
          cylinder_sub_batch_no: subCylinder.cylinder_sub_batch_no,
          cylinder_sub_weight: subCylinder.cylinder_sub_weight,
          cylinder_sub_status: subCylinder.cylinder_sub_status,
          cylinder_sub_previous_test_date:
            subCylinder.cylinder_sub_previous_test_date,
          cylinder_sub_d_d: subCylinder.cylinder_sub_d_d,
          cylinder_sub_c_d: subCylinder.cylinder_sub_c_d,
          cylinder_sub_v_ii: subCylinder.cylinder_sub_v_ii,
          cylinder_sub_v_ie: subCylinder.cylinder_sub_v_ie,
          cylinder_sub_r_c: subCylinder.cylinder_sub_r_c,
          cylinder_sub_bung_check: subCylinder.cylinder_sub_bung_check,
          cylinder_sub_h_t: subCylinder.cylinder_sub_h_t,
          cylinder_sub_p_p: subCylinder.cylinder_sub_p_p,
          cylinder_sub_p: subCylinder.cylinder_sub_p,
          cylinder_sub_n_weight: subCylinder.cylinder_sub_n_weight,
          cylinder_sub_f_i: subCylinder.cylinder_sub_f_i,
          cylinder_sub_p_t: subCylinder.cylinder_sub_p_t,
          cylinder_sub_n_t_d: subCylinder.cylinder_sub_n_t_d,
        };
      }
      const token = localStorage.getItem("token");
      setLoading(true);
      const response = await axios.put(
        `${BASE_URL}/api/web-update-cylinder-new/${id}`,
        dataSubCyl,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Update Successfull")
      navigate(`/cylinder-view/${localStorage.getItem("viewedCylinderId")}`);
    } catch (error) {
      console.error("Error updating the cylinder data", error);
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
  } 
  return (
    <Layout>
      
      <div className="p-4 sm:p-6">
        <div className="mb-6">
          <h3 className="text-xl sm:text-2xl font-bold">
            {subId ? "Edit Sub-Cylinder" : "Edit Cylinder"}
          </h3>
        </div>

        <form
        id="addIndiv"
          onSubmit={handleSubmit}
          className="bg-white p-6 shadow rounded-md"
        >
          {/* Fields for sub-cylinder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <TextField
              label="R K Serial No"
              inputProps={{
                maxLength: 6,
                minLength: 6,
                pattern: "[0-9]{6}",
              }}
              onKeyDown={handleKeyDown}
              name="cylinder_sub_barcode"
              value={subCylinder.cylinder_sub_barcode}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Cylinder No"
              name="cylinder_sub_company_no"
              inputProps={{ maxLength: 10, minLength: 1 }}
              onKeyDown={handleKeyDown}
              value={subCylinder.cylinder_sub_company_no}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              select
              label="Manufacturer"
              name="cylinder_sub_manufacturer_id"
              value={subCylinder.cylinder_sub_manufacturer_id}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            >
              {manufacturer.map((manu) => (
                <MenuItem key={manu.id} value={manu.id}>
                  {manu.manufacturer_name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Month"
              name="cylinder_sub_manufacturer_month"
              value={subCylinder.cylinder_sub_manufacturer_month}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            >
              {month.map((m) => (
                <MenuItem key={m.value} value={m.value}>
                  {m.value}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Year"
              name="cylinder_sub_manufacturer_year"
              inputProps={{ maxLength: 2, minLength: 2 }}
              onKeyDown={handleKeyDown}
              value={subCylinder.cylinder_sub_manufacturer_year}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Batch No"
              name="cylinder_sub_batch_no"
              value={subCylinder.cylinder_sub_batch_no}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Tare Weight"
              name="cylinder_sub_weight"
              inputProps={{ maxLength: 5, pattern: "[0-9]*\\.?[0-9]*" }}
              value={subCylinder.cylinder_sub_weight}
              onKeyDown={handleTareDown}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
            {/* further for branch two  */}
            {branchId === "2" && userTypeId === "2" && (
              <>
                <TextField
                  select
                  label="Status"
                  name="cylinder_sub_status"
                  value={subCylinder.cylinder_sub_status}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                >
                  {aR.map((a) => (
                    <MenuItem key={a.value} value={a.value}>
                      {a.value}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Previous Test Date"
                  name="cylinder_sub_previous_test_date"
                  value={subCylinder.cylinder_sub_previous_test_date}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  // yes or no
                  select
                  label="Depressurization & Degassing"
                  name="cylinder_sub_d_d"
                  value={subCylinder.cylinder_sub_d_d}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                >
                  {yesNo.map((y) => (
                    <MenuItem key={y.value} value={y.value}>
                      {y.value}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  // yes or no
                  select
                  label="Cleaning Done (External & Internal)"
                  name="cylinder_sub_c_d"
                  value={subCylinder.cylinder_sub_c_d}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                >
                  {yesNo.map((y) => (
                    <MenuItem key={y.value} value={y.value}>
                      {y.value}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  // Ok, Rejected
                  select
                  label="Visual Inspection (Internal)"
                  name="cylinder_sub_v_ii"
                  value={subCylinder.cylinder_sub_v_ii}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                >
                  {okRejected.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.value}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  // RT, R , Rejected
                  select
                  label="Visual Inspection (External)"
                  name="cylinder_sub_v_ie"
                  value={subCylinder.cylinder_sub_v_ie}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                >
                  {rtRRejected.map((r) => (
                    <MenuItem key={r.value} value={r.value}>
                      {r.value}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Rejection Code"
                  name="cylinder_sub_r_c"
                  value={subCylinder.cylinder_sub_r_c}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                >
                  {rejectCode.map((rc) => (
                    <MenuItem key={rc.value} value={rc.value}>
                      {rc.value}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  // Yes,no
                  select
                  label="Bung Thread Check"
                  name="cylinder_sub_bung_check"
                  value={subCylinder.cylinder_sub_bung_check}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                >
                  {yesNo.map((y) => (
                    <MenuItem key={y.value} value={y.value}>
                      {y.value}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  // ok , rejected
                  select
                  label="Hydrostatic Test (25 kg/cm2)"
                  name="cylinder_sub_h_t"
                  value={subCylinder.cylinder_sub_h_t}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                >
                  {okRejected.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.value}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  // ye sor no
                  select
                  label="Primer + Paint"
                  name="cylinder_sub_p_p"
                  value={subCylinder.cylinder_sub_p_p}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                >
                  {yesNo.map((y) => (
                    <MenuItem key={y.value} value={y.value}>
                      {y.value}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  // yes or no
                  select
                  label="Punching of new test date and repairer's identification mark"
                  name="cylinder_sub_p"
                  value={subCylinder.cylinder_sub_p}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                >
                  {yesNo.map((y) => (
                    <MenuItem key={y.value} value={y.value}>
                      {y.value}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="New Tare Weight(Kg)"
                  name="cylinder_sub_n_weight"
                  value={subCylinder.cylinder_sub_n_weight}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  // yes no
                  select
                  label="Final Inspection for Marking Stencil Paint"
                  name="cylinder_sub_f_i"
                  value={subCylinder.cylinder_sub_f_i}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                >
                  {yesNo.map((y) => (
                    <MenuItem key={y.value} value={y.value}>
                      {y.value}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  // ok , rejected
                  select
                  label="Pneumatic Test (12 kg/cm2)"
                  name="cylinder_sub_p_t"
                  value={subCylinder.cylinder_sub_p_t}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                >
                  {okRejected.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.value}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Next Test Date"
                  name="cylinder_sub_n_t_d"
                  value={subCylinder.cylinder_sub_n_t_d}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                />
              </>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <Link
            to={`/cylinder-view/${localStorage.getItem("viewedCylinderId")}`}
          >
            <Button variant="outlined" color="secondary">
              Back to Cylinder View
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default CylinderEdit;
