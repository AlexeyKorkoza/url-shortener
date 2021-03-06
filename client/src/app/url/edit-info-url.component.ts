import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators, FormControl} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { Url } from '../shared/models/url.model';
import { UrlService } from '../shared/services/url.service';

@Component({
  selector: 'app-edit-info-url',
  templateUrl: 'edit-info-url.component.html',
  styleUrls: ['edit-info-url.component.scss']
})
export class EditInfoUrlComponent implements OnInit {

  url: Url;
  editUrlForm: any;
  id: string;

  constructor(
      private urlService: UrlService,
      private route: ActivatedRoute,
      private formBuilder: FormBuilder) {
      this.editUrlForm = formBuilder.group({
      'list_tags': [null, [Validators.required, Validators.pattern('([a-zA-Z]{1,},){1,}')]],
      'description': [null, [Validators.required]]
    })
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    let list_tags = '';
    this.urlService.getUrlById(this.id).subscribe(
        data => {
          this.url = data.url;
          (<FormControl>this.editUrlForm.controls['description'])
                .setValue(this.url.description, { onlySelf: true });
          this.url.list_tags.forEach((item) => {
              list_tags += item + ',';
          });

          (<FormControl>this.editUrlForm.controls['list_tags'])
              .patchValue(list_tags, { onlySelf: true });
        }
    );
  }

  update(url: Url) {
      this.urlService.updateUrlById(this.id, url).subscribe();
  }

}
