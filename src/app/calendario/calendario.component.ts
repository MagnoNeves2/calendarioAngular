import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CalendarOptions, DateSelectArg, EventClickArg, EventInput, EventSourceInput } from '@fullcalendar/angular'; // useful for typechecking
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Compromissos } from '../model/Compromissos';
import { CompromissosService } from '../service/compromissos.service';
import { salve } from './retorno-api'

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

  @ViewChild('content') content: TemplateRef<any> | undefined;

  formulario!: FormGroup;

  closeResult = '';

  teste!: string;

  listaCompromissos: Compromissos[] = [];

  evento: EventSourceInput = [{
    id: "Teste",
    date: "2021-06-15T13:00:00"
  }];

  listaMock: EventSourceInput = [
    {
      title: 'Reunião Agendada Automaticamente',
      date: '2021-06-15',
      backgroundColor: 'tomato',
      borderColor: 'white'
    },
    {
      title: 'Reunião Agendada Automaticamente',
      date: '2021-06-16',
      backgroundColor: 'tomato',
      borderColor: 'white'
    },
    {
      title: 'Remedio',
      start: '2021-06-17T12:00',
      end: '2021-06-17T13:00',
      backgroundColor: "#86EE3F",
      borderColor: "white",
      textColor: "black"
    },
  ]

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private service: CompromissosService) { }

  ngOnInit() {

    this.formulario = this.formBuilder.group({
      data: [null],
      titulo: [null]
    });

    this.listarCompromissos();

  }

  listarCompromissos(): EventSourceInput {
    let retorno: EventSourceInput;
    this.service.listaDeCompromissos().subscribe((resp: Compromissos[]) => {
      let teste = new Compromissos;
      retorno = teste.toModel(resp);
      this.listaMock = retorno;
      // this.listaCompromissos = resp;
      // this.criarListaEventos();
      console.log(retorno);
    });

    return retorno;
  }

  calendarOptions: CalendarOptions = {
    // Ativa e define o cabeçalho do Calendario
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    // Define qual a visualização inicial do calendario (mes, semana, dia, lista)
    initialView: 'timeGridDay',
    // Habilita ou desabilita os fins de semana
    weekends: true,
    // Diz se pode ou não ser editável
    editable: true,
    // Diz se pode ou não ser selecionável
    selectable: true,
    // Cria um esboço em volta da celula q se está arrastando para demonstrar q o lugar q estava era "reservado"
    selectMirror: true,
    // 
    dayMaxEvents: true,
    expandRows: true,
    select: this.criarEvento.bind(this),
    eventClick: this.removerEvento.bind(this),
    // dateClick: this.selecionarDia.bind(this),
    locale: 'pt-br',
    buttonText: {
      today: 'Hoje',
      month: 'Mês',
      week: 'Semana',
      list: 'Lista',
      day: 'Dia'
    },
    dayHeaderFormat: {
      weekday: 'long'
    },
    slotMinTime: '09:00:00',
    slotMaxTime: '18:00:00',
    slotLabelFormat: {
      hour: '2-digit',
      minute: '2-digit'
    },
    selectOverlap: false,
    events: (info, successCallback, failureCallback) => { 
      this.service.listaDeCompromissos().subscribe((resp: Compromissos[]) => {
        let eventos: EventInput[] = [];
        resp.forEach((compromisso) => {
          let evento:EventInput = {
            id: compromisso.id.toString(),
            start: compromisso.start,
            end: compromisso.end,
            title: compromisso.title,
            date: compromisso.date,
            backgroundColor: compromisso.backgroundColor,
            borderColor: compromisso.borderColor,
            groupId: compromisso.groupId,
          }

          eventos.push(evento);
        })
        successCallback(eventos);
      })
     },
    timeZone: "America/Sao_Paulo",
    slotDuration: '00:15:00',
    nowIndicator: true,
    navLinks: true,



  };

  criarEvento(celulaSelecionada: DateSelectArg) {
    const valorTitulo = this.formulario.get('titulo')?.value;
    let titulo = (typeof valorTitulo === 'undefined') ? '' : valorTitulo;
    const calendarioAPI = celulaSelecionada.view.calendar;

    calendarioAPI.unselect();

    if (titulo !== '') {
      // this.open(this.content);
      let eventoSeraCriado = calendarioAPI.addEvent({
        id: '0987654321',
        title: "Teste de compromisso",
        start: celulaSelecionada.startStr,
        end: celulaSelecionada.endStr,
        allDay: celulaSelecionada.allDay,
      });

      console.log(eventoSeraCriado?.startStr);

      console.log(this.formulario.get('data')?.setValue(eventoSeraCriado?.startStr));
    }
  }

  removerEvento(eventoSelecionado: EventClickArg) {
    if (eventoSelecionado.event.title) {
      eventoSelecionado.event.remove();
    }
  }

  selecionarDia(celulaSelecionada: any) {
    alert('date click! ' + celulaSelecionada.dateStr)
  }

  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  criarListaEventos(): EventSourceInput {
    let lista: EventInput[] = []
    this.listaCompromissos.forEach((compromisso) => {
      let evento: EventInput = {
        id: compromisso.id.toString(),
        groupId: compromisso.groupId,
        title: compromisso.title,
        start: compromisso.start,
        end: compromisso.end,
        date: compromisso.date,
        backgroundColor: compromisso.backgroundColor,
        borderColor: compromisso.borderColor
      }

      lista.push(evento);
    });

    let retorno: EventSourceInput = lista
    // console.log(retorno);
    // console.log(this.listaCompromissos);
    

    return retorno;
  }


}
