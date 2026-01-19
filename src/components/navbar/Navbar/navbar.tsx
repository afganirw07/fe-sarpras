"use client"

import CardNav from '../card-nav';

const Navbar = () => {
const items = [
{
    label: "Tentang",
    bgColor: "#E0F2FE", 
    textColor: "#0C4A6E",
    links: [
      { label: "Beranda", ariaLabel: "Home" },
      { label: "Tentang Kami", ariaLabel: "About us" }
    ]
  },
  {
    label: "Kontak",
    bgColor: "#BAE6FD",
    textColor: "#0C4A6E", 
    links: [
      { label: "Media Sosial", ariaLabel: "Media Social" },
      { label: "Email", ariaLabel: "Email Us" },
      { label: "Nomor", ariaLabel: "Number" }
    ]
  },
  {
    label: "FAQ",
    bgColor: "#7DD3FC", 
    textColor: "#0C4A6E", 
    links: [
      { label: "FAQ", ariaLabel: "FAQ" }
    ]
  },
  
];


  return (
    
   <CardNav
  logo="SarprasTb"
  logoAlt="Company Logo"
  items={items}
  baseColor="#FFF"        
  menuColor="#00008b "        
  buttonBgColor="#1e90ff"    
  buttonTextColor="#FFFFFF"
  ease="power3.out"
/>


  );
};

export default Navbar