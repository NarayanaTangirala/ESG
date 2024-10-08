import { Component, OnInit, ViewChild, PLATFORM_ID, Inject } from '@angular/core';
import { ESGDataService } from '../../services/esg-data.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { isPlatformBrowser } from '@angular/common';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    FormsModule,
    CommonModule,
    NgChartsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  companyName = '';
  isBrowser: boolean;
  isLoading = false;
  selectedChartType: ChartType = 'pie';
  selectedGraphType: ChartType = 'line';
  view: 'charts' | 'graphs' = 'charts';
  selectedType: ChartType = this.selectedChartType;
  searchedCompanies: string[] = [];
  selectedCompany: string | null = null;

  chartTypes: ChartType[] = ['pie', 'bar', 'radar'];
  graphTypes: ChartType[] = ['line', 'polarArea'];

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'ESG Scores'
      }
    }
  };

  public chartData: ChartConfiguration['data'] = {
    labels: ['Environmental', 'Social', 'Governance'],
    datasets: [{ 
      data: [], 
      label: 'ESG Scores',
      backgroundColor: ['rgba(255, 99, 132, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)']
    }]
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private esgDataService: ESGDataService, private snackBar: MatSnackBar) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  ngAfterViewInit(): void {
    this.updateChartOrGraph();
  }

  loadCompanies(): void {
    this.esgDataService.getAllCompanies().subscribe(
      (companies) => {
        this.searchedCompanies = companies;
      },
      (error) => {
        this.showError('Error loading companies');
      }
    );
  }

  setView(newView: 'charts' | 'graphs'): void {
    this.view = newView;
    this.selectedType = newView === 'charts' ? this.selectedChartType : this.selectedGraphType;
    this.updateChartOrGraph();
  }

  handleSearch(): void {
      if (this.companyName) {
        this.validateCompany(this.companyName);
      }
  }

  validateCompany(companyName: string): void {
    this.esgDataService.getESGData(companyName).subscribe(
      (data) => {
        if (data && data.environmentalScore !== undefined) {
          this.updateChartData(data);
          this.selectedCompany = companyName;
          if (!this.searchedCompanies.includes(companyName)) {
            this.searchedCompanies.push(companyName);
          }
        } else {
          this.showError(`No data found for company "${companyName}"`);
        }
      },
      (error) => {
        this.showError(`No data found for company "${companyName}"`);
      }
    );
  }

  handleCompanySelect(company: string): void {
    this.selectedCompany = company;
    this.fetchESGData(company);
  }

  fetchESGData(company: string): void {
    this.isLoading = true;
    this.esgDataService.getESGData(company).subscribe(
      (data) => {
        this.isLoading = false;
        if (data && data.environmentalScore !== undefined) {
          this.updateChartData(data);
        } else {
          this.showError(`No data found for company "${company}"`);
        }
      },
      (error) => {
        this.isLoading = false;
        this.showError('Error fetching ESG data');
      }
    );
  }

  updateChartData(data: { environmentalScore: number; socialScore: number; governanceScore: number }): void {
    this.chartData.datasets[0].data = [
      data.environmentalScore,
      data.socialScore,
      data.governanceScore
    ].map(score => (typeof score === 'number' ? score : 0));
    console.log('Updated chart data:', this.chartData);
    this.updateChartOrGraph();
  }

  updateChartOrGraph(): void {
    if (this.chart && this.chart.chart) {
      this.chart.chart.update();
    }
  }

  handleTypeChange(event: any): void {
    const newType = event.value as ChartType;
    if (this.view === 'charts') {
      this.selectedChartType = newType;
    } else {
      this.selectedGraphType = newType;
    }
    this.selectedType = newType;
    this.updateChartOrGraph();
  }

  importCSV(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = (evt: any) => {
        const csvData = evt.target.result;
        this.processCSV(csvData);
      };
      reader.onerror = () => {
        this.showError('Error reading file');
      };
    };
    input.click();
  }
  
  private processCSV(csvData: string): void {
    const data = [];
    if (!csvData) {
      this.showError('CSV file is empty');
      return;
    }
    const lines = csvData.split('\n');
    if (lines.length < 2) {
      this.showError('CSV file has insufficient data');
      return;
    }
  
    const headers = lines[0].split(',');
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length === headers.length) {
        const entry: any = {};
        for (let j = 0; j < headers.length; j++) {
          entry[headers[j].trim()] = values[j].trim();
        }
        data.push(entry);
      }
    }
  
    console.log('Processed CSV data:', data);
  
    const importedCompany = data[0].Company;
    const esgScores = {
      environmentalScore: +data[0].Environmental,
      socialScore: +data[0].Social,
      governanceScore: +data[0].Governance
    };
  
    this.updateChartData(esgScores); 
    this.addCompanyToList(importedCompany); 
    this.selectCompany(importedCompany);
  
    this.showError('CSV import successful');
  }

  importXML(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xml';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = (evt: any) => {
        const xmlData = evt.target.result;
        this.processXML(xmlData);
      };
      reader.onerror = () => {
        this.showError('Error reading file');
      };
    };
    input.click();
  }
  
  private processXML(xmlData: string): void {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlData, 'application/xml');
  
    const company = xmlDoc.getElementsByTagName('Company')[0]?.textContent || 'Unknown Company';
    const environmental = xmlDoc.getElementsByTagName('Environmental')[0]?.textContent || '0';
    const social = xmlDoc.getElementsByTagName('Social')[0]?.textContent || '0';
    const governance = xmlDoc.getElementsByTagName('Governance')[0]?.textContent || '0';
  
    const esgScores = {
      environmentalScore: +environmental,
      socialScore: +social,
      governanceScore: +governance
    };
  
    this.updateChartData(esgScores); 
    this.addCompanyToList(company); 
    this.selectCompany(company); 
  
    this.showError('XML import successful');
  }  
  
  private addCompanyToList(company: string): void {
    if (!this.searchedCompanies.includes(company)) {
      this.searchedCompanies.push(company); 
    }
  }

  private selectCompany(company: string): void {
    this.selectedCompany = company;
    this.updateChartOrGraph();
  }

  exportCSV(): void {
    if (!this.selectedCompany || !this.chartData.datasets[0].data.length) return;
    const numericData: number[] = this.chartData.datasets[0].data as number[];
    const csvData = this.convertToCSV(this.selectedCompany, numericData); 
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const fileName = `${this.selectedCompany}_esg_scores.csv`.replace(/\s+/g, '_');
    saveAs(blob, fileName);
  }

  private convertToCSV(company: string, data: number[]): string {
    const headers = ['Company', 'Environmental', 'Social', 'Governance'];
    const csvRows = [headers.join(',')];
    csvRows.push([company, ...data].join(',')); 
    return csvRows.join('\n');
  }

  exportPDF(): void {
    if (!this.selectedCompany || !this.chartData.datasets[0].data.length) return;

    const doc = new jsPDF();
    doc.text(`ESG Scores for ${this.selectedCompany}`, 14, 15);
    
    const spaceBetween = 10; 
    const tableStartY = 15 + spaceBetween; 

    const tableData = [
        ['Company', 'Environmental', 'Social', 'Governance'],
        [this.selectedCompany, ...this.chartData.datasets[0].data] 
    ];

    (doc as any).autoTable({
        head: [tableData[0]],
        body: [tableData[1]],
        startY: tableStartY 
    });

    const fileName = `${this.selectedCompany}_esg_scores.pdf`.replace(/\s+/g, '_'); 
    doc.save(fileName);
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}