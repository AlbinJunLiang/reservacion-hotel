import { Component, OnInit } from '@angular/core';

interface Image {
  url: string;
  alt: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  images: Image[] = [
    { url: 'https://floorplannerespanol.com/wp-content/uploads/Dormitorio-de-estilo-japones-con-elementos-minimalistas-y-funcionales.webp', alt: 'Imagen 1' },
    { url: 'https://casadecor.es/assets/uploads/2017/02/dormitorio-jardin-interior-casadecor2013.jpg', alt: 'Imagen 2' },
    { url: 'https://www.micamaabatible.es/blog/imagenes/Como-decorar-una-habitacion-juvenil-para-una-chica.jpg', alt: 'Imagen 3' },
  ];
  currentSlideIndex = 0;
  interval: any;

  ngOnInit() {
    this.startCarousel();
  }

  startCarousel() {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 5000); // Cambia de imagen cada 5 segundos (5000 ms)
  }

  nextSlide() {
    this.currentSlideIndex = (this.currentSlideIndex + 1) % this.images.length;
  }

  prevSlide() {
    this.currentSlideIndex = (this.currentSlideIndex - 1 + this.images.length) % this.images.length;
  }

  nextSlideIndex() {
    return (this.currentSlideIndex + 1) % this.images.length;
  }

  ngOnDestroy() {
    clearInterval(this.interval); // Limpia el intervalo al destruir el componente
  }
}
