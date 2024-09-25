import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {Setor} from "src/models/setor/Setor";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {SetorService} from "src/services/SetorService";
import {SalvarSetor} from "src/models/setor/SalvarSetor";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'dialog-setor',
  templateUrl: 'dialog.setor.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormField, MatInput, MatLabel, MatProgressSpinner, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSetorComponent implements OnInit{
  public setor: Setor = {}
  loading: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: any,
    private readonly service : SetorService,
    private readonly changeDetectorRef: ChangeDetectorRef) {
    if (data && data.setor)
      this.setor = data.setor
  }

  ngOnInit() {
    if (this.setor.descricao == undefined)
      this.setor.descricao = ""
  }

  salvar(){
    this.loading = true;
    var request : SalvarSetor = {
      descricao: this.setor.descricao
    }
    this.service.salvar(request).subscribe(
      (response) => {
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      (error) => {
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      }
    )
  }
}
