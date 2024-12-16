import {AfterViewInit, ChangeDetectorRef, Component, inject, OnInit, ViewChild} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {DialogAporteComponent} from "../dialogs/aporte/dialog.aporte.component";
import {MatPaginator, MatPaginatorIntl, PageEvent} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {Aporte} from "src/app/models/aporte/Aporte";
import {DialogExcluirEntidadeComponent} from "src/app/components/dialogs/excluir/dialog.excluir.entidade.component";
import {ResponseApi} from "src/app/models/ResponseApi";
import {Paginado} from "src/app/models/Paginado";
import {HttpErrorResponse} from "@angular/common/http";
import {BaseComponent} from "src/app/components/base.component";
import {ToastrService} from "ngx-toastr";
import {AporteService} from "src/app/services/AporteService";
import {AbstractControl, FormControl, FormGroup} from "@angular/forms";
import {PesquisarAporte} from "src/app/models/aporte/PesquisarAporte";
import {TipoAtivoEnum} from "src/app/models/enums/TipoAtivoEnum";
import {MovimentacaoEnum} from "src/app/models/enums/MovimentacaoEnum";
import {MatSelectChange} from "@angular/material/select";
import {Acao} from "src/app/models/acao/Acao";
import {TituloPublico} from "src/app/models/titulo-publico/TituloPublico";
import {AcaoService} from "src/app/services/AcaoService";
import {TituloPublicoService} from "src/app/services/TituloPublicoService";

@Component({
  selector: 'aporte',
  templateUrl: './aporte.component.html'
})
export class AporteComponent extends BaseComponent implements AfterViewInit, OnInit{
  public pesquisarAporte: PesquisarAporte = {};
  public tiposAtivos: TipoAtivoEnum[] = [
    TipoAtivoEnum.Acao,
    TipoAtivoEnum.TituloPublico
  ];
  public movimentacoes: MovimentacaoEnum[] = [
    MovimentacaoEnum.Compra,
    MovimentacaoEnum.Venda
  ];
  private readonly dialog = inject(MatDialog);
  public loading: boolean = false;
  public btnLoading: boolean = false;
  public dataSource = new MatTableDataSource<Aporte>();
  public maxDate: Date = new Date();
  public ativos? : any[] = [];
  public pesquisarAtivo: FormControl = new FormControl<String>('');
  public displayedColumns: string[] = ['tipoAtivo', 'ativo', 'ticker', 'movimentacao', 'preco', 'quantidade', 'dataAporte', 'acoes'];
  @ViewChild(MatPaginator) paginator: MatPaginator = new MatPaginator(new MatPaginatorIntl(), ChangeDetectorRef.prototype);
  @ViewChild(MatSort) sort: MatSort = new MatSort();
  constructor(private readonly aporteService : AporteService,
              private readonly acaoService : AcaoService,
              private readonly tituloPublicoService: TituloPublicoService,
              private readonly cdr: ChangeDetectorRef,
              public override toastr: ToastrService) {
    super(toastr);
  }

  ngOnInit(){
    this.inicializarPesquisaForm();
    this.pesquisarAtivo.valueChanges.subscribe(() => {
      this.filtrarAtivos()
    })
  }

  ngAfterViewInit(): void {
    this.carregarAportes(0, 10);
  }

  inicializarPesquisaForm(): void{
    this.formGroup = new FormGroup({
      tipoAtivo: new FormControl(this.pesquisarAporte.tipoAtivo),
      ativo: new FormControl(this.pesquisarAporte.ativoId),
      dataInicio: new FormControl(this.pesquisarAporte.dataInicio),
      dataFim: new FormControl(this.pesquisarAporte.dataFim)
    });
  }

  onSelectChangeTipoAtivoId(event: MatSelectChange){
    this.ativos = [];
    this.formGroup.get('ativo')?.setValue(undefined);
  }

  filtrarAtivos(){
    let ativo = this.pesquisarAtivo.value;
    if (ativo && ativo.length >= 5){
      if (this.tipoAtivo?.value == TipoAtivoEnum.Acao)
        this.carregarAcoes(ativo)
      else
        this.carregarTitulosPublico(ativo)
    }
  }

  carregarAcoes(razaoSocial: String){
    this.acaoService.filtrar(0, 10, razaoSocial).subscribe({
      next: (response:ResponseApi<Paginado<Acao>>) => {
        this.ativos = response.data?.itens;
        this.formGroup.get('ativo')?.setValue(undefined);
      },
      error: (errorResponse : HttpErrorResponse) => {
        console.log(errorResponse);
      }
    })
  }

  carregarTitulosPublico(descricao: String){
    this.tituloPublicoService.filtrar(0, 10, descricao).subscribe({
      next: (response:ResponseApi<Paginado<TituloPublico>>) => {
        this.ativos = response.data?.itens;
        this.formGroup.get('ativo')?.setValue(undefined);
      },
      error: (errorResponse : HttpErrorResponse) => {
        console.log(errorResponse);
      }
    })
  }

  get tipoAtivo() : AbstractControl<any, any> | null{
    return this.formGroup.get('tipoAtivo');
  }

  get ativo() : AbstractControl<any, any> | null{
    return this.formGroup.get('ativo');
  }

  get dataInicio() : AbstractControl<any, any> | null{
    return this.formGroup.get('dataInicio');
  }

  get dataFim() : AbstractControl<any, any> | null{
    return this.formGroup.get('dataFim');
  }

  openDialogCreateAporte() {
    this.dialog.open(DialogAporteComponent, {
      data: {
        carregarAportes: this.carregarAportes.bind(this)
      }
    });
  }

  openDialogEditAporte(aporte : Aporte) {
    this.dialog.open(DialogAporteComponent, {
      data: {
        aporte
      }
    });
  }

  openDialogExcluirAporte(aporte : Aporte) {
    this.dialog.open(DialogExcluirEntidadeComponent, {
      data: {
        nomeEntidade: "aporte",
        nomeAtivo: aporte.acaoId && !aporte.tituloPublicoId ? aporte.razaoSocial : aporte.descricao
      }
    });
  }

  carregarAportes(pagina:number, tamanho:number, tipoAtivo?: Number, ativoId?: Number, dataInicio?: string, dataFim?: string){
    this.loading = true;
    this.btnLoading = true;
    this.aporteService.filtrar(pagina, tamanho).subscribe({
      next: (responseApi:ResponseApi<Paginado<Aporte>>) => {
        this.paginator.pageIndex = pagina;
        this.paginator.pageSize = tamanho;
        this.paginator.length = <number>responseApi.data?.total;
        this.dataSource.data = <Aporte[]>responseApi.data?.itens;
        this.loading = false;
        this.btnLoading = false;
      },
      error: (errorResponse : HttpErrorResponse) => {
        this.loading = false;
        this.btnLoading = false;
        console.log(errorResponse);
      }
    });
    this.cdr.detectChanges();
  }

  pageHandler(event:PageEvent){
    var pesquisarReq: PesquisarAporte = {
      tipoAtivo: this.tipoAtivo?.value,
      ativoId: this.ativo?.value,
      dataInicio: this.dataInicio?.value?.toLocaleDateString("pt-BR"),
      dataFim: this.dataFim?.value?.toLocaleDateString("pt-BR")
    }
    this.carregarAportes(event.pageIndex, event.pageSize, pesquisarReq.tipoAtivo, pesquisarReq.ativoId, pesquisarReq.dataInicio, pesquisarReq.dataFim);
  }

  limpar(){
    this.btnLoading = false;
    this.loading = false;
    this.formGroup.get('tipoAtivo')?.setValue( undefined);
    this.formGroup.get('ativo')?.setValue(undefined);
    this.formGroup.get('dataInicio')?.setValue(undefined);
    this.formGroup.get('dataFim')?.setValue(undefined);
    this.cdr.detectChanges();
  }

  consultar(){
    this.btnLoading = true;
    this.loading = true;
    var pesquisarReq: PesquisarAporte = {
      tipoAtivo: this.tipoAtivo?.value,
      ativoId: this.ativo?.value,
      dataInicio: this.dataInicio?.value?.toLocaleDateString("pt-BR"),
      dataFim: this.dataFim?.value?.toLocaleDateString("pt-BR")
    }
    this.carregarAportes(0, 10, pesquisarReq.tipoAtivo, pesquisarReq.ativoId, pesquisarReq.dataInicio, pesquisarReq.dataFim);
  }

  protected readonly TipoAtivoEnum = TipoAtivoEnum;
}
