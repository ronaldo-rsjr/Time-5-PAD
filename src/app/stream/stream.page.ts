import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // pra chamar link
import { DomSanitizer} from '@angular/platform-browser'; // pra deixar o link safe
import { Observable } from 'rxjs'; // ajudar pegar dados
import { ToastController } from '@ionic/angular'; // pra mostrar a notificacao
import { AngularFireDatabase } from '@angular/fire/database'; // pegar dados do firebase
import { AuthService } from './../services/auth.service';
import { MenuController } from '@ionic/angular'; // side menu

@Component({
  selector: 'app-stream',
  templateUrl: './stream.page.html',
  styleUrls: ['./stream.page.scss'],
})
export class StreamPage implements OnInit {

  // API do YT
  private apiYT = 'AIzaSyDhZoTUSyiiIW40Qmp2CLqoguUpRrYYM50'; 
  // titulos
  titulos: Observable<any>; // pega os dados do request
  titulosArr: any[] = []; // array de titulos
  // videos 
  playlistYT: any[] = ['https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1']; // a playlist | Obs.: primeiro item nao deve ficar vazio
  currentVideo: any = ''; // video atual e primeiro ao abrir a pagina | Obs.: nao deve ficar vazio
  inputVideo: any = ''; // aqui e o input do usuario
  videoLink: any; // link do video | obs.: deve ter o '/embed/' no lugar do 'watch?v='
  videoID: any; // ID do video | ex.:https://www.youtube.com/watch?v=""FKE-4mlpk34"
  cont = 1; // a vez de cada video
  // thumbnails
  thumbs: any[] = ['https://img.youtube.com/vi/5qap5aO4i9A/default.jpg']; // array de thumbnails
  thumbnail: any; // thumbnail do video
  // historico
  historicoYT: any[] = []; // array do historico de videos
  hisThumbs: any[] = []; // array de thumbnails
  titulosHis: any[] = []; // array de titulos
  // firebase
  userHist: any[] = []; // array que vai ser carregado do firebase
  userTitles: any[] = [];
  userThumbs: any[] = [];
  userName: any; // nome do usuario
  PATH: any; // caminho dos dados do user no firebase

  constructor(
    public sanitizer: DomSanitizer, 
    public http: HttpClient, 
    public toastCtrl: ToastController,
    public afd: AngularFireDatabase, 
    public authService: AuthService,
    public menu: MenuController) { 
      
    }

  ngOnInit(){ 
    // 'setar' primeiro video
    this.currentVideo = this.playlistYT[0]; // vai passar o primeiro video no array pra iniciar quando o user abrir a pagina
    this.currentVideo = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentVideo); // vai deixar o link inicial safe
    this.getTitle('5qap5aO4i9A', this.titulosArr); // titulo do video inicial
    this.openMenu(); 
  }

  apagarFB(){ // apagar historico do firebase
    // apagar historico local
    this.historicoYT.forEach(element => {
      this.historicoYT.splice(element, 1); // remove
    });
    this.hisThumbs.forEach(element => {
      this.hisThumbs.splice(element, 1); // remove 
    });
    this.titulosHis.forEach(element => {
      this.titulosHis.splice(element, 1);
    });
    // apagar historico firebase
    this.afd.list(this.PATH).remove(this.userName.key);
  }

  updateThumbs(){ // atualiza titulos dos videos no historico
    this.userThumbs.length = 0;
    // this.userTitles.length = 0;
    let thumb;
    this.userHist.forEach(element => {
      let videoid;
      if (element.includes('embed')) { 
        videoid = element.substr(30);
        thumb = 'https://img.youtube.com/vi/' + videoid + '/default.jpg'; 
        this.userThumbs.push(thumb);
        // this.getTitle(videoid, this.userTitles)
      }
    });
  }

  openMenu() { // abre side menu
    this.menu.enable(true, 'start');
    this.menu.open('start');
  }

  ionViewWillEnter(){ // ao abrir a pagina
    this.showToast1(); // mpstra depois
    this.showToast(); // mostra primeiro
  }

  async getName(){ // pega nome do usuario
    this.userName = await((await this.authService.getAuth().currentUser).displayName); // passa o nome pra variavel
    console.log(this.userName);
    this.PATH = 'Historico_Usuario/' + this.userName; // 'seta' o caminho no firebase
    return this.userName; 
  }

  addData(){ // add dados ao firebase
    this.afd.list(this.PATH).push(this.historicoYT[this.historicoYT.length - 1]); // envia o ultimo item do historico
  }

  getDataFromFirebase(){ // pega dados do firebase
    this.afd.list(this.PATH).valueChanges().subscribe( // procura o caminho e pega os dados
      data => {
        console.log(data);
        this.userHist = data; // passa os dados pro array
        this.updateThumbs();
      }
    )
  }

  saveUserName(){ // pega nome do usuario e atualiza os dados
    this.getName();
    this.getDataFromFirebase();
  }

  // metodos pra carregar dados do firebase
  async showToast() {
    await this.toastCtrl.create({
      message: "Bem vindo(a)!",
      duration: 200000,
      position: 'middle',
      buttons: [{
        text: 'OK',
        handler: () => { 
          this.saveUserName();
          console.log("ok clicked");
        }
      }]
    }).then(res => res.present());
  }
  async showToast1() {
    await this.toastCtrl.create({
      message: "Por favor, clique no 'OK' para carregar seus dados :D", 
      duration: 200000,
      position: 'middle',
      buttons: [{
        text: 'OK',
        handler: () => { 
          this.saveUserName();
          console.log("ok clicked");
        }
      }]
    }).then(res => res.present());
  }

  getTitle(videoid, array){ // pega o titulo do video
    // faz o request do link
    this.titulos = this.http.get('https://www.googleapis.com/youtube/v3/videos?id=' + videoid + '&key=' + this.apiYT + '&fields=items(snippet(title))&part=snippet');
    this.titulos.subscribe(data => { // pega os dados
      //let vari = data.items[0].snippet.title.slice(0, 25) + '...'; // limitar tamanho do titulo do video
      array.push(data.items[0].snippet.title); // passa o titulo pro array
    });
  }

  addVideo(){ // add video na playlist e apaga videos iguais
    // extrai o ID do video pelo link
    if (this.inputVideo.includes('youtu.be')) { this.videoID = this.inputVideo.substr(17); } // geralmente esse tipo vem do mobile
    else if (this.inputVideo.includes('watch?v=')) { this.videoID = this.inputVideo.substr(32); }// esse tipo so da pra pegar pelo navegador
    else if (this.inputVideo.includes('embed')) { this.videoID = this.inputVideo.substr(30); } // se tiver c/ 'embed'

    // vai tirar os coiso q tiver dps do ID "&feature"
    if (this.videoID.includes('&feature')) { this.videoID = this.videoID.substr(0, this.videoID.indexOf('&feature')); }

    // 'setar' as seguintes variaveis
    this.inputVideo = ''; // reseta no input
    this.videoLink = 'https://www.youtube.com/embed/' + this.videoID + '?autoplay=1'; // passa o ID passado pelo usuario ao link
    this.thumbnail = 'https://img.youtube.com/vi/' + this.videoID + '/default.jpg'; // passa o ID pra pegar a thumb

    // mandar cada link pra cada array
    this.playlistYT.push(this.videoLink); // adiciona o video no ultimo lugar do array
    this.thumbs.push(this.thumbnail); // adiciona a thumbnail no array
    this.getTitle(this.videoID, this.titulosArr); // adiciona o titulo do video no array
    console.log('Adicionou o video: ' + this.videoLink);

    this.playlistYT = this.playlistYT.filter((este, i) => this.playlistYT.indexOf(este) === i); // vai apagar os video iguais
  }

  callHistorico(video){ // adiciona video ao historico
    let id;
    if (video.includes('embed')) { id = video.substr(30); }
    if (id.includes('?autoplay=1')) { id = id.substr(0, id.indexOf('?autoplay=1')); }

    let thisvid;
    thisvid = 'https://www.youtube.com/embed/' + id; // passa o ID passado pelo usuario ao link
    this.thumbnail = 'https://img.youtube.com/vi/' + id + '/default.jpg'; // passa o ID pra pegar a thumb

    console.log('Adicionou ao historico: ' + thisvid);
    this.historicoYT.push(thisvid); // adiciona video ao historico
    this.hisThumbs.push(this.thumbnail); // adiciona a thumbnail no array
    this.getTitle(id, this.titulosHis); // adiciona titulo

    this.addData(); // salva historico
  }
  
  excludeVideo(link){ // exclui video selecionado da playlist
    let x = this.playlistYT.indexOf(link); // vai pegar o index do video selecionado
    link = this.sanitizer.bypassSecurityTrustResourceUrl(link); // vai deixar o link safe B)
    let linkstring = link.toString();
    let cvstring = this.currentVideo.toString();

    if (cvstring === linkstring) { // se o link a ser apagado for o video que esta assistindo, faz o seguinte
      if ((x >= 2 && x < this.playlistYT.length - 1) || x === 0){ // se tem 3 elementos ou mais e nao for ultimo do array, ou for o primeiro
        this.currentVideo = this.playlistYT[x + 1]; // vai pro proximo video
      } else if (x === 1 && this.playVideo.length === 2 || x === this.playlistYT.length - 1) { // ultimo elemento no array ou for o segundo
        this.currentVideo = this.playlistYT[x - 1]; // volta um elemento no array              //e so tiver 2 elementos no array
      }
      this.callHistorico(this.currentVideo); // como vai mudar de video, vai adicionar ao historico
      this.currentVideo = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentVideo); // vai deixar o link safe B)
    } // se nao for, ele nao atualiza o video, continua assistindo normalmente :)

    this.playlistYT.splice(x, 1); // vai remover o link do array
    this.thumbs.splice(x, 1); // remove respectiva thumbnail
    this.titulosArr.splice(x, 1); // remove respectivo titulo
  }

  excludeHist(link){ // apaga video do historico
    let x = this.historicoYT.indexOf(link); // vai pegar o index do video selecionado
    link = this.sanitizer.bypassSecurityTrustResourceUrl(link); // vai deixar o link safe B)

    this.historicoYT.splice(x, 1); // vai remover o link do array
    this.hisThumbs.splice(x, 1); // remove respectiva thumbnail
    this.titulosHis.splice(x, 1); // remove respectivo titulo
  }

  playVideo(link){ // metodo pra iniciar video que for selecionado na lista da playlist
    this.currentVideo = link; // passa o link do video selecionado como video atual
    this.callHistorico(link); // add no historico
    this.currentVideo = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentVideo); // vai deixar o link safe B)
    console.log('Selecionou o video: ' + link);
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
      this.callHistorico(this.currentVideo); // add no historico
      this.currentVideo = this.sanitizer.bypassSecurityTrustResourceUrl(this.currentVideo); // vai deixar o link safe B)
      console.log('Mudou pro video: ' + this.videoLink);
    }
  }

  verifyLink(){ // verifica se o link tem dominio do yt | Obs.: habilita/desabilita botao de add video
    let isenable;
    if (this.inputVideo.indexOf('https://www.youtube.com/watch?v=') !== - 1 || this.inputVideo.indexOf('https://youtu.be/') !== - 1
    || this.inputVideo.indexOf('https://www.youtube.com/embed/') !== - 1) { isenable = true; } // botao habilita
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

  verifyArray(){ // verifica se so tem 1 item no array | Obs.: habilita/disabilita botao de excluir video
    let so1;
    if (this.playlistYT.length <= 1) { so1 = true; } // se o tamanha do array for 1 ou menos
    else { so1 = false; } // tem mais de 1 video
    return so1; // retorna o valor
  }
}
