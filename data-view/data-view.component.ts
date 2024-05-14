
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { NavController } from '@ionic/angular';
import { Preferences } from '@capacitor/preferences';
import { Chart } from 'chart.js/auto'


@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.scss'],
})
export class DataViewComponent  implements OnInit {
	overnightData: OvernightSleepData[] = [];
	sleepyData: StanfordSleepinessData[] = [];
	username: string = '';
	selectedTab: string = 'overnightData';
	interval: any;

  constructor(private router: Router) { }
  
  ngOnInit() {
	this.tabChanged();
    }

	ngAfterViewInit() {
	// updates data and then draws chart
	this.updateData().then(() => {
		this.drawChart();
	  });
	}

  async retrieveUsername() {
	// gets current username
    try {
      const { value } = await Preferences.get({ key: 'activeUser' });
      if (value) {
        this.username = value;
      } else {
      }
    } catch (error) {
      console.error('Error retrieving username:', error);
    }
  }
  
  async updateData() {
	// updates the data displayed if there is new data
	try {
		await this.retrieveUsername();
		const { value } = await Preferences.get({ key: this.username + " data" });
		if (value) {
		this.overnightData = JSON.parse(value).map((item: any) => {
			return new OvernightSleepData(new Date(item.sleepStart), new Date(item.sleepEnd));
		});
		}
	} catch (error) {
		console.error("No data found: ", error);
	}
  }

  drawChart() {
	// draws the chart using overnight data
	const lastSevenDays = this.overnightData.slice(-7);
	if (this.overnightData) {
		const sumString = this.overnightData[0].summaryString();
		const hours = parseInt(sumString.split(' ')[0]);
	
		const chartData = lastSevenDays.map(item => {
			const hours = parseInt(item.summaryString().split(' ')[0]);
			const day = item.getSleepStartSummary();
			return {x: day, y: hours};
		})
		const ctx = document.getElementById('myChart') as HTMLCanvasElement;
		const myChart = new Chart(ctx, {
			type: 'line',
			data: {
			  labels: chartData.map(item => item.x),
			  datasets: [{
			label: 'Most Recent Sleep',
			data: chartData.map(item => item.y),
			borderColor: '#481E7F',
			tension: 0.1
				}]
			},
			options: {
				plugins: {
					legend: {
						labels: {
							color: 'white',
							font: {
								family: 'DM Sans', // Use DM Sans font for legend labels
								size: 14,
								weight: 'bold'
							}
						}
					}
				},
				scales: {
					y: {
						beginAtZero: true,
						title: {
							display: true,
							text: 'Hours',
							color: 'white',
							font: {
								family: 'DM Sans', // Use DM Sans font for y-axis title
								size: 14,
								weight: 'bold'
							}
						},
						ticks: {
							stepSize: 1,
							color: 'white',
							font: {
								family: 'DM Sans', // Use DM Sans font for y-axis ticks
								size: 12,
								weight: 'normal'
							}
						},
						grid: {
							color: 'black'
						}
					},
					x: {
						ticks: {
							color: 'white',
							font: {
								family: 'DM Sans', // Use DM Sans font for x-axis ticks
								size: 12,
								weight: 'normal'
							}
						},
						// grid: {
						// 	color: 'black'
						// }
					}
				}
			}
		});
	} else {
		console.log("no data to graph");
	}
}

  tabChanged() {
	// decides action taken based on what tab user switches to
    if (this.selectedTab === 'loggedMoods') {
      this.displayLoggedMoods();
    } else {
		this.updateData();
    }
  }

  async displayLoggedMoods() {
	// displays sleepy data and logged moods
	try {
		await this.retrieveUsername();
		const { value : moodValue } = await Preferences.get({ key: this.username + "_loggedMood" });
		if (moodValue) {
		this.sleepyData = JSON.parse(moodValue).map((item: any) => {
			return new StanfordSleepinessData(item.loggedValue, new Date(item.loggedAt));
		});
		}
	} catch (error) {
		console.error("No data found: ", error);
	}
  }

  formatDate(dateTime: Date): string {
	// formats date
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return new Date(dateTime).toLocaleString('en-US', options);
  }

  async deleteOvernightItem(data: any) {
    // deletes the data upon sliding the card and selecting delete
    const index1 = this.overnightData.indexOf(data);
    if (index1 !== -1) {
        this.overnightData.splice(index1, 1);
    }
	await Preferences.set({
		key: this.username + " data",
		value: JSON.stringify(this.overnightData),
	  });
  }

  async deleteMoodItem(data: any) {
    // deletes the data upon sliding the card and selecting delete
    const index1 = this.sleepyData.indexOf(data);
    if (index1 !== -1) {
        this.sleepyData.splice(index1, 1);
    }
	await Preferences.set({
		key: this.username + "_loggedMood",
		value: JSON.stringify(this.sleepyData),
	  });
 	}
  	// routes to other pages
	goToHome() {
		this.router.navigate(['/home']);
	}

	logSleep() {
	this.router.navigate(['/log-sleep-component']);
	const currentDateTime = new Date();
	}

	viewData() {
		this.router.navigate(['/data-view-component']);
	}

	goToSettings() {
		this.router.navigate(['/settings-component']);
	}
}