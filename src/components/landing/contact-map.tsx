"use client";
import {useState} from 'react';
export function ContactMap(){const [open,setOpen]=useState(false);return <div className="contact-map">{open?<iframe title="Localização da Barbearia Auto Stilo" src="https://www.google.com/maps?q=Rua+do+Tanque+395+Monte+Siao+MG&output=embed" referrerPolicy="no-referrer"/>:<button type="button" className="cta" onClick={()=>setOpen(true)}>Carregar mapa</button>}</div>}
