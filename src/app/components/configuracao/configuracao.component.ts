import {BaseComponent} from "../base.component";
import {AfterViewInit, Component} from "@angular/core";
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'configuracao',
  templateUrl: './configuracao.component.html',
  styleUrl: './configuracao.component.css'
})
export class ConfiguracaoComponent extends BaseComponent implements AfterViewInit {

  constructor(private router: Router, toastr: ToastrService) {
    super(toastr);
  }

  ngAfterViewInit() {
  }
}
