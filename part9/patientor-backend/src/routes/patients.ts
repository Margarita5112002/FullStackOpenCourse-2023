import express from 'express';
import patientService from '../services/patientService';
import toNewPatient from '../utils';
const router = express.Router();

router.get('/', (_req, res) => {
    res.send(patientService.getPatients());
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const patient = patientService.getPatientById(id);
    if (patient) {
        res.send(patient);
    } else {
        res.status(404).send({ error: 'cannot find patient' });
    }
});

router.post('/', (req, res) => {
    try {
        const newPatient = toNewPatient(req.body);
        const addedPatient = patientService.addPatient(newPatient);
        res.json(addedPatient);
    } catch (error: unknown) {
        let errorMessage = 'Something wrong';
        if (error instanceof Error) {
            errorMessage += 'Error: ' + error.message;
        }
        res.status(400).send(errorMessage);
    }
});

export default router;