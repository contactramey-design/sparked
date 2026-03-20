import React from 'react'
import { Navigate } from 'react-router-dom'

/** Legacy URL: full compliance + school info now lives at /for-schools */
const CompliancePage: React.FC = () => {
  return <Navigate to="/for-schools#school-compliance" replace />
}

export default CompliancePage
