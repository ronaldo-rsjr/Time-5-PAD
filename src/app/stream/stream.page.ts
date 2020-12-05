import { NgForOf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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

  // oq falta:
  // - trocar video qnd ele acabar
  // - stream pra varios usuarios
  // - pesquisa por video **se der tempo**

  constructor(public sanitizer: DomSanitizer, public http: HttpClient) { }

  playlistYT: any[] = ['https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1']; // a playlist | Obs.: primeiro item nao deve ficar vazio
  currentVideo: any = ''; // video atual e primeiro ao abrir a pagina | Obs.: nao deve ficar vazio
  inputVideo: any = ''; // aqui e o input do usuario
  videoLink: any; // link do video | obs.: deve ter o '/embed/' no lugar do 'watch?v='
  videoID: any; // ID do video | ex.:https://www.youtube.com/watch?v=""FKE-4mlpk34"
  cont = 1; // a vez de cada video
  same: boolean;

  ngOnInit(){ // start()
    this.currentVideo = this.playlistYT[0]; // vai passar o primeiro video no array pra iniciar quando o user abrir a pagina
    this.currentVideo = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentVideo); // vai deixar o link inicial safe
  }

  addVideo(){ // add video na playlist
    this.videoID = this.inputVideo.substr(32); // vai separar o ID do video do link inteiro
    this.inputVideo = ''; // reseta no input
    this.videoLink = 'https://www.youtube.com/embed/' + this.videoID + '?autoplay=1'; // passa o ID passado pelo usuario ao link

    this.playlistYT.push(this.videoLink); // adiciona o video no ultimo lugar do array
    console.log('Adicionou o video: ' + this.videoLink);

    this.playlistYT = this.playlistYT.filter((este, i) => this.playlistYT.indexOf(este) === i); // vai apagar os video iguais
  }

  playVideo(link){ // metodo pra iniciar video que for selecionado na lista da playlist
    this.currentVideo = link; // passa o link do video selecionado como video atual
    this.currentVideo = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentVideo); // vai deixar o link safe B)
    console.log('Selecionou o video: ' + this.videoLink);
  }

  nextVideo(){ // metodo pra pular pro proximo video
    this.cont += 1; // add no contador
    this.changeVideo();
  }

  previousVideo(){ // metodo pra voltar pro video anterior
    this.cont -= 1; // diminui no contador
    this.changeVideo();
  }

  changeVideo(){ // metodo pra mudar de video
    for (let i = this.cont - 1; i < this.cont; i ++){ // checa e evita fazer os mesmo comandos mais de 1x
      this.currentVideo = this.playlistYT[i]; // toca o proximo video na playlist
      this.currentVideo = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentVideo); // vai deixar o link safe B)
      console.log('Mudou pro video: ' + this.currentVideo);
    }
  }

  verifyLink(){ // verifica se o link tem dominio do yt | Obs.: habilita/desabilita botao de add video
    let isenable;
    if (this.inputVideo.indexOf('https://www.youtube.com/watch?v=') !== - 1) { isenable = true; } // botao habilita
    else { isenable = false; } // botao desabilita
    return !isenable; // retorna o valor
  }

  verifyArrayLast(){ // verifica se o video eh o ultimo do array | Obs.: habilita/desabilita botao de proximo video
    let lastVideo;
    if (this.cont + 1 <= this.playlistYT.length) { lastVideo = true; } // e o ultimo do array
    else { lastVideo = false; } // nao e o ultimo
    return !lastVideo; // retorna o valor
  }

  verifyArrayFirst(){ // verifica se o video eh o primeiro do array | Obs.: habilita/desabilita botao de previous video
    let firstVideo;
    if (this.cont - 1 > this.playlistYT.indexOf(this.currentVideo) + 1) { firstVideo = true; } // e o primeiro do array
    else { firstVideo = false; } // nao e o primeiro
    return !firstVideo; // retorna o valor
  }

  excludeVideo(link){ // exclui video selecionado da playlist
    // tslint:disable-next-line: prefer-const
    let x = this.playlistYT.indexOf(link); // vai pegar o index do video selecionado
    link = this.sanitizer.bypassSecurityTrustResourceUrl(link); // vai deixar o link safe B)
    // tslint:disable-next-line: prefer-const
    let linkstring = link.toString();
    // tslint:disable-next-line: prefer-const
    let cvstring = this.currentVideo.toString();

    if (cvstring === linkstring) { // se o link a ser apagado for o video que esta assistindo, faz o seguinte
      if ((x >= 2 && x < this.playlistYT.length - 1) || x === 0){ // se tem 3 elementos ou mais e nao for ultimo do array, ou for o primeiro
        this.currentVideo = this.playlistYT[x + 1]; // vai pro proximo video
      } else if (x === 1 && this.playVideo.length === 2 || x === this.playlistYT.length - 1) { // ultimo elemento no array ou for o segundo
        this.currentVideo = this.playlistYT[x - 1]; // volta um elemento no array              //e so tiver 2 elementos no array
      }
      this.currentVideo = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentVideo); // vai deixar o link safe B)
    } // se nao for, ele nao atualiza o video, continua assistindo normalmente :)

    this.playlistYT.splice(x, 1); // vai remover o link do array
  }

  verifyArray(){ // verifica se so tem 1 item no array | Obs.: habilita/disabilita botao de excluir video
    let so1;
    if (this.playlistYT.length <= 1) { so1 = true; } // se o tamanha do array for 1 ou menos
    else { so1 = false; } // tem mais de 1 video
    return so1; // retorna o valor
  }
}