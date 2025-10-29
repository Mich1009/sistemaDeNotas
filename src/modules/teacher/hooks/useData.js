import { useState } from "react";
import { getCourses, academicService } from '../services/apiTeacher';

const useData = () => {

    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [allCycles, setAllCycles] = useState([]);



    return {

    }
}