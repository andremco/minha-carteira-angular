import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {AbstractControl, FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule} from "@angular/forms";
import {MatFormField, MatLabel, MatError} from "@angular/material/form-field";
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
  imports: [MatDialogModule, MatButtonModule, FormsModule, MatFormField, MatInput, MatLabel, MatProgressSpinner, CommonModule, MatError, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSetorComponent implements OnInit{
  public setor: Setor = {}
  public setorForm: FormGroup = new FormGroup('');
  loading: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly data: any,
    private readonly service : SetorService,
    private readonly changeDetectorRef: ChangeDetectorRef) {
    if (data && data.setor)
      this.setor = data.setor
  }

  ngOnInit() {
    this.setorForm = new FormGroup({
      descricao: new FormControl(this.setor.descricao, [
        Validators.required,
        Validators.maxLength(60)
      ])
    })
  }

  get descricao() : AbstractControl<any, any> | null{
    return this.setorForm.get('descricao');
  }

  descricaoErrorMessage() : string {
    if (this.descricao?.hasError('required')) {
      return "Campo descrição é obrigatório";
    }
    if (this.descricao?.hasError('maxlength')) {
      return "Campo descrição é permitido até 60 caracteres";
    }
    return "";
  }

  salvar(){
    this.loading = true;
    var request : SalvarSetor = {
      descricao: this.setor.descricao
    }
    this.service.salvar(request).subscribe(
      {
        next: (response) => {
            this.loading = false;
            this.changeDetectorRef.detectChanges();
        },
        error: (error) => {
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        }
      }
    )
  }
}
