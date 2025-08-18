import ComplaintInput from '@/components/complaints/ComplaintInput'
import ComplaintsTable from '@/components/complaints/ComplaintsTable'
import React from 'react'

const page = () => {
  return (
    <>
      <div className=' flex flex-col items-center gap-6'>
        <ComplaintInput />
        <ComplaintsTable />
      </div>
    </>
  )
}

export default page