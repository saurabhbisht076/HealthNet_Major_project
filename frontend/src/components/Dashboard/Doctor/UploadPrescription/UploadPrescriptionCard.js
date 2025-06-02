import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import FileUploader from "../../../FileUploader/FileUploader";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import api from "../../../../api";

export default function UploadPrescriptionCard(props) {
  const [medicalReports, setMedicalReports] = useState([]);

  useEffect(() => {
    async function fetchReports() {
      if (!props.appointment?.patid) return;
      const res = await api.getMedicalReports({ patid: props.appointment.patid });
      if (!res.data.error) setMedicalReports(res.data);
    }
    fetchReports();
  }, [props.appointment?.patid]);

  return (
    <Card sx={{ maxWidth: "100%", textAlign: "center" }} variant="outlined">
      <CardContent>
        <br />
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Prescription to
        </Typography>
        <Typography variant="h5" component="div">
          {props.appointment.patname}
        </Typography>
        <Typography variant="caption" color="text.secondary" component="div">
          {`appointment on: ${props.appointment.date}`}
        </Typography>
        <br />
        {/* Medical Reports Section */}
        <Typography variant="h6" gutterBottom>
          Patient Medical Reports
        </Typography>
        <Grid container spacing={2}>
          {medicalReports.map((report) => (
            <Grid item xs={12} key={report._id}>
              <Paper sx={{ p: 2, mb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body2" noWrap>
                  {report.file.originalname}
                </Typography>
                <Button
                  href={`${process.env.REACT_APP_API_URL}/patient/medicalreport/download/${report._id}`}
                  startIcon={<FileDownloadIcon />}
                  variant="outlined"
                >
                  Download
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
        <br />
        <FileUploader appointment={props.appointment} useKey={props.useKey} />
      </CardContent>
    </Card>
  );
}