import { Component, EventEmitter, Input, Output } from '@angular/core';

declare function require(path: string): string;

@Component({
    selector: 'bg-badgecard',
    host: {
        class: 'badgecard'
    },
    template: `
        <div
            class="badgecard-x-status badgestatus badgestatus-{{status}}"
            *ngIf="status">

            {{ status }}

        </div>

        <div class="badgecard-x-body">

            <div
                class="badgecard-x-image"
                *ngIf="image">

                <img
                    class="badgeimage"
                    [loaded-src]="image"
                    [loading-src]="loadingImage"
                    [error-src]="errorImage"
                    width="80" />

            </div>

            <a
				*ngIf="routerLink"
				class="badgecard-x-title u-text-breakword"
				[routerLink]="routerLink">

				{{ title }}

			</a>

            <a
                *ngIf="publicUrl"
                class="badgecard-x-title u-text-breakword"
                [href]="publicUrl">

                {{ title }}

            </a>

            <p
                class="badgecard-x-desc"
                [truncatedText]="description"
                [maxLength]="120">

            </p>

        </div>

        <div class="badgecard-x-footer">

            <div class="badgecard-x-date">

                <time
                    [date]="date"
                    format="mediumDate">
                </time>

            </div>

            <button
                *ngIf="showAction"
                class="buttonicon buttonicon-clear"
                (click)="actionClicked.emit($event)">

                <svg icon="icon_more"></svg>

            </button>

        </div>
    `
})
export class BgBadgecard {

    readonly loadingImage =
        require('../../../breakdown/static/images/badge-loading.svg');

    readonly errorImage =
        require('../../../breakdown/static/images/badge-failed.svg');

    @Input()
    entityId: string;

    @Input()
    title: string;

    @Input()
    description: string;

    @Input()
    image?: string;

    @Input()
    date: string;

    @Input()
    status?: string;

    @Input()
	routerLink: any[];

    @Input()
    publicUrl: string;

    @Input()
    showAction = false;

    @Output()
    actionClicked = new EventEmitter<MouseEvent>();
}