import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { Breadcrumb } from './components/breadcrumb/breadcrumb';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Breadcrumb],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Cars-frontend');
}
