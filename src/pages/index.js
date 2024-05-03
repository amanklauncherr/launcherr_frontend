import SelectLanguage from '@/components/SelectLanguage'
import { useRouter } from 'next/router'

import React from 'react'

const index = () => {
  const router = useRouter();
  const handleredirect  = () => {
     router.push('/auth/login')
  }

  return (
    <>
    <SelectLanguage onClick={handleredirect}/>
    </>
  )
}

export default index