import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() dataSource: any
  placeholderImg = 'assets/images/placeholder_img.svg'
  likeColor: string = 'basic'

  like() {
    this.likeColor = (this.likeColor === 'basic') ? 'warn' : 'basic'
  }

}
