import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  constructor() { }
  print(encabezado: string[], cuerpo:Array<any>, titulo: string, guardar?:boolean){
    const doc = new jsPDF({
      orientation: 'portrait',
      unit:'px',
      format: 'letter'
    });

    doc.text(titulo, doc.internal.pageSize.width / 2, 25,{align:'center'});
    autoTable(doc, {
      head:[encabezado],
      body: cuerpo
    });
    if(guardar){
      const hoy = new Date();
      doc.save(hoy.getDate()+hoy.getMonth()+hoy.getFullYear()+hoy.getTime()+".pdf");
    }
  }
}
