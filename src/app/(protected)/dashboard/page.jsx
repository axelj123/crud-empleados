import EmployeeList from '../../../components/employees/EmployeeList';
import { Header } from '../../../layout/header';
import React from 'react'

export default function page() {
    return (

        <div>

            <Header />
            <div className='mt-10'>

                <EmployeeList />

            </div>
        </div>



    )
}
