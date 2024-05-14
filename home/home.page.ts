import { Component } from '@angular/core';
import { SleepService } from '../services/sleep.service';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
	stanfordSleepiness: StanfordSleepinessData | null = null;
	loggedMood: number = 1;
	username: string = '';
	currentTime: string | undefined;
	interval: any;

  constructor(private router: Router) {
	}

	ngOnInit() {
		// updates clock on page
		this.retrieveUsername();
		this.updateClock();
		setInterval(() => {
		  this.updateClock();
		}, 1000);
	}
	ngOnDestroy() {
		clearInterval(this.interval);
	  }
	

	updateClock() {
		// clock function
		const date = new Date();
		const hours = date.getHours().toString().padStart(2, '0');
		const minutes = date.getMinutes().toString().padStart(2, '0');
		const seconds = date.getSeconds().toString().padStart(2, '0');
		const period = date.getHours() >= 12 ? 'PM' : 'AM';
		this.currentTime = `${hours}:${minutes}:${seconds} ${period}`;
	}
	async retrieveUsername() {
		// gets username from storage
		try {
		  const { value } = await Preferences.get({ key: 'activeUser' });
		  if (value) {
			this.username = value;
			console.log("this.username: ", this.username);
		  } else {
			console.log('No username found in storage');
		  }
		} catch (error) {
		  console.error('Error retrieving username:', error);
		}
	  }


	async saveLoggedMood() {
		// saves the logged mood from user
		this.stanfordSleepiness = new StanfordSleepinessData(this.loggedMood);
		try {
		  const existingData = await Preferences.get({ key: this.username + "_loggedMood"});
		  let newMoodData: StanfordSleepinessData[] = [];
		  if (existingData.value) {
			newMoodData = JSON.parse(existingData.value).map((item: any) => {
			  return new StanfordSleepinessData(item.loggedValue, new Date(item.loggedAt));
			});
		  }
		  newMoodData.push(this.stanfordSleepiness);
		  await Preferences.set({ key: this.username + '_loggedMood', value: JSON.stringify(newMoodData) });
		  
		  // Log retrieved mood data after saving
		  const { value } = await Preferences.get({ key: this.username + "_loggedMood" });
		  if (value) {
			const retrievedMood = JSON.parse(value);
			console.log('Retrieved mood:', retrievedMood);
		  } else {
			console.log('No mood data found in storage');
		  }
		} catch (error) {
		  console.error('Error saving logged mood: ', error);
		}
	}


	
	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}
	goToHome() {
		this.router.navigate(['/home']);
	}

	logSleep() {
	this.router.navigate(['/log-sleep-component']);
	}

	viewData() {
		this.router.navigate(['/data-view-component']);
	}

	goToSettings() {
		this.router.navigate(['/settings-component']);
	}
}