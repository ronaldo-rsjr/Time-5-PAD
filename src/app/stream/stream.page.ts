import { Component, OnInit } from '@angular/core';

// to sanitize the link
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.page.html',
  styleUrls: ['./stream.page.scss'],
})
export class StreamPage implements OnInit {

  playlistYT: any; // a playlist | Obs.: usado futuramente
  // Obs.: o currentVideo nao deve ficar vazio
  currentVideo: any = 'https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1'; // video atual e primeiro ao abrir a pagina
  inputVideo: any; // aqui e o input do usuario
  videoLink: any; // link do video | obs.: deve ter o '/embed/' no lugar do 'watch?v='
  videoID: any; // ID do video | ex.:https://www.youtube.com/watch?v=""FKE-4mlpk34"

  constructor(public sanitizer: DomSanitizer) {
   }

  ngOnInit() {
    this.currentVideo = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentVideo); // vai deixar o link inicial safe 
  }

  addVideo(){ // add video na playlist | Obs.: por enquanto so troca o video atual
    this.videoID = this.inputVideo.substr(32); // vai separar o ID do video do link inteiro
    this.videoLink = 'https://www.youtube.com/embed/' + this.videoID + '?autoplay=1'; // passa o ID passado pelo usuario ao link
    this.currentVideo = this.videoLink; // passa o link pro video atuall
    this.currentVideo = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentVideo); // vai deixar o link safe B)
    console.log('Adicionou o video: ' + this.currentVideo);
  }
}
