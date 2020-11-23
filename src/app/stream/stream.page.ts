import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';

// pra deixar o link safe
import { DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.page.html',
  styleUrls: ['./stream.page.scss'],
})
export class StreamPage implements OnInit {

  constructor(public sanitizer: DomSanitizer) { }

  playlistYT: any[] = ['https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1']; // a playlist | Obs.: usado futuramenteArray<string> = []
  // Obs.: o 'currentVideo' nao deve ficar vazio
  currentVideo: any = 'https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1'; // video atual e primeiro ao abrir a pagina
  inputVideo: any = ''; // aqui e o input do usuario
  videoLink: any; // link do video | obs.: deve ter o '/embed/' no lugar do 'watch?v='
  videoID: any; // ID do video | ex.:https://www.youtube.com/watch?v=""FKE-4mlpk34"
  cont = 1; // a vez de cada video
  isenable: boolean; // variavel pra habilitar/desabilitar botao de add na playlist
  lastVideo: boolean; // variavel pra checar se e o ultimo video da playlist

  ngOnInit() {
    this.currentVideo = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentVideo); // vai deixar o link inicial safe
    // this.play();
  }

  addVideo(){ // add video na playlist | Obs.: por enquanto so troca o video atual
    this.videoID = this.inputVideo.substr(32); // vai separar o ID do video do link inteiro
    this.inputVideo = ''; // reseta no input
    this.videoLink = 'https://www.youtube.com/embed/' + this.videoID + '?autoplay=1'; // passa o ID passado pelo usuario ao link
    this.playlistYT.push(this.videoLink); // adiciona o video no ultimo lugar do array
    console.log('Adicionou o video: ' + this.videoLink);
  }

  nextVideo(){ // metodo pra pular pro proximo video
      this.cont += 1; // add no contador
      for (let i = this.cont - 1; i < this.cont; i ++){ // checa e evita fazer os mesmo comandos mais de 1x
        this.currentVideo = this.playlistYT[i]; // toca o proximo video na playlist
        this.currentVideo = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentVideo); // vai deixar o link safe B)
        console.log('Mudou pro video: ' + this.currentVideo);
    }
  }

  verifyLink(){ // verifica se o link tem dominio do yt | Obs.: habilita/desabilita botao de add video
    if (this.inputVideo.indexOf('https://www.youtube.com/watch?v=') !== - 1) { this.isenable = true; } // botao habilita
    else { this.isenable = false; } // botao desabilita
    return !this.isenable; // retorna o valor
  }

  verifyArray(){ // verifica se o video e o ultimo do array | Obs.: habilita/desabilita botao de proximo video
    if (this.cont + 1 <= this.playlistYT.length) { this.lastVideo = true; } // e o ultimo do array
    else { this.lastVideo = false; } // nao e o ultimo
    return !this.lastVideo; // retorna o valor
  }

  // play(){
  //   for (let i = 0; i < this.playlistYT.length - 1; i ++){
  //     this.currentVideo = this.playlistYT[i]; // passa o link pro video atual
  //     this.currentVideo = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentVideo); // vai deixar o link safe B)
  //     console.log('Playing video: ' + this.currentVideo);
  //   }
  // }
}
