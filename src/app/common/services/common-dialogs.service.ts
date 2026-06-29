import { Injectable } from '@angular/core';
import { ConfirmDialog } from '../dialogs/confirm-dialog.component';
import { ShareSocialDialog } from '../dialogs/share-social-dialog/share-social-dialog.component';
import { MarkdownHintsDialog } from '../dialogs/markdown-hints-dialog.component';


@Injectable()
export class CommonDialogsService {
	confirmDialog: ConfirmDialog;
	shareSocialDialog: ShareSocialDialog;;
	markdownHintsDialog: MarkdownHintsDialog;

	constructor() {}

	init(
		confirmDialog: ConfirmDialog,
		shareSocialDialog: ShareSocialDialog,
		markdownHintsDialog: MarkdownHintsDialog
	) {
		this.confirmDialog = confirmDialog;
		this.shareSocialDialog = shareSocialDialog;
		this.markdownHintsDialog = markdownHintsDialog;
	}
}
