import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Diagnosis, Entry, Gender, Patient } from "../../types";
import patientService from "../../services/patients";

const DisplayEntry = ({ entry, diagnoses }: { entry: Entry, diagnoses: Diagnosis[] }) => {
    return <div>
        {entry.date} <i>{entry.description}</i>
        <ul>
            {entry.diagnosisCodes?.map(code =>
                <li key={code}>{code}: {diagnoses.find(d => d.code === code)?.name}</li>)}
        </ul>
    </div>;
};

const PatientPage = ({ diagnoses }: { diagnoses: Diagnosis[] }) => {
    const id = useParams().id;
    const [patient, setPatient] = useState<Patient | undefined>();

    useEffect(() => {
        if (id) {
            patientService.getById(id).then(data => {
                setPatient(data);
            });
        }
    }, [id]);

    if (!patient) {
        return <div>cannot find patient</div>;
    }

    return (
        <div>
            <h2>
                {patient.name}
                {patient.gender === Gender.Female && <FemaleIcon />}
                {patient.gender === Gender.Male && <MaleIcon />}
                {patient.gender === Gender.Other && <TransgenderIcon />}
            </h2>
            <div>ssh: {patient.ssn}</div>
            <div>occupation: {patient.occupation}</div>
            <h3>entries</h3>
            {patient.entries?.map(e => 
                <DisplayEntry key={e.id} entry={e} diagnoses={diagnoses}/>)}
        </div>
    );
};

export default PatientPage;