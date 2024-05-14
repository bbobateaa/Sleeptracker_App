import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { Preferences } from '@capacitor/preferences';
import { LogSleepServiceService } from '../log-sleep-service.service';
import { HourSleptPage } from '../hour-slept/hour-slept.page';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-log-sleep',
  templateUrl: './log-sleep.component.html',
  styleUrls: ['./log-sleep.component.scss'],
})
export class LogSleepComponent implements OnInit {
  startTime: Date | null = null;
  endTime: Date | null = null;
  overnightSleepData: OvernightSleepData | null = null;
  diff: string | null = null;
  isStartTimeSet: boolean = false;
  loggedMood: number = 1;
  stanfordSleepiness: StanfordSleepinessData | null = null;
  username: string = '';
  hours: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  interval: any;
  newMoodData: StanfordSleepinessData[] = [];
  moodSummary: string = '';

  constructor(private router: Router, private sleepService: LogSleepServiceService,
    private modalController: ModalController) { }

  ngOnInit() {
    this.retrieveUsername();
  }

  startTimer() {
    // timer for logging sleep
    this.interval = setInterval(() => {
      if (++this.seconds === 60) {
        this.seconds = 0;
        if (++this.minutes === 60) {
          this.minutes = 0;
          this.hours++;
        }
      }
    }, 1000);
  }

  updateStartTime() {
    // starts timer and the service
    this.isStartTimeSet = true;
    this.sleepService.startSleepTimer();
    this.startTimer();
  }

  async retrieveUsername() {
    // gets username from storage
    try {
      const { value } = await Preferences.get({ key: 'activeUser' });
      if (value) {
        this.username = value;
      } else {
        console.log('No username found in storage');
      }
    } catch (error) {
      console.error('Error retrieving username:', error);
    }
  }

  async updateEndTime() {
    // ends the timer and finalizes data collected
    this.isStartTimeSet = false;
    this.sleepService.endSleepTimer();
    this.sleepService.logSleepData(this.username);
    this.saveLoggedMood();
    this.hourSlept();
    clearInterval(this.interval);
    this.hours = 0;
    this.minutes = 0;
    this.seconds  = 0;
  }

  totalHours(): string {
    return this.sleepService.totalHours();
  }

  async saveLoggedMood() {
    // saves logged mood to data
    this.stanfordSleepiness = new StanfordSleepinessData(this.loggedMood);
    try {
      const existingData = await Preferences.get({ key: this.username + "_loggedMood"});
      if (existingData.value) {
        this.newMoodData = JSON.parse(existingData.value).map((item: any) => {
          return new StanfordSleepinessData(item.loggedValue, new Date(item.loggedAt));
        });
      }
      this.moodSummary = this.stanfordSleepiness.summaryString();
      this.newMoodData.push(this.stanfordSleepiness);
      await Preferences.set({ key: this.username + '_loggedMood', value: JSON.stringify(this.newMoodData) });
    } catch (error) {
      console.error('Error saving logged mood: ', error);
    }
  }
  formatDate(dateTime: number): string {
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

  async hourSlept() {
    // opens up hour-slept modal to display data to user
    const modal = await this.modalController.create({
      component: HourSleptPage,
      componentProps: {
        username: this.username, 
        totalSleep: this.totalHours(),
        startTime: this.sleepService.getStartTime(),
        endTime: this.sleepService.getEndTime(),
        sleepMood: this.loggedMood,
        moodSummary: this.stanfordSleepiness?.summaryString()
      },
    });
    return await modal.present();
  }

  // routes to other pages
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