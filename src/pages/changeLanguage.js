import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import SelectLanguage from '@/components/SelectLanguage'
import Home from '@/screens/Home'
import { useRouter } from 'next/router'
import React from 'react'

const changeLanguage = () => {
  const router = useRouter();
  const handleredirect = () => {
    router.push('/auth/login')
  }
  return (
    <>
   <SelectLanguage onClick={handleredirect} />
    </>
  )
}

export default changeLanguage