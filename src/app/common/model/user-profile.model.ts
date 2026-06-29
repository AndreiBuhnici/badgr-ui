import {ManagedEntity} from './managed-entity';
import {
	ApiUserProfile,
	UserProfileRef,
} from './user-profile-api.model';
import {StandaloneEntitySet} from './managed-entity-set';

/**
 * Logical interface to the current user's profile, providing access to personal information (as the entitiy) and
 * access to various managed profile objects.
 */
export class UserProfile extends ManagedEntity<ApiUserProfile, UserProfileRef> {

	protected get profileService() {
		return this.commonManager.profileManager.profileService;
	}
	get username() { return this.apiModel.username; }

	set username(username: string) { this.apiModel.username = username; }

	get id() { return this.apiModel.id; }

	get email() { return this.apiModel.email; }

	get role() { return this.apiModel.role; }

	static currentProfileId = "currentUserProfile";

	protected buildApiRef(): UserProfileRef {
		return {
			"@id": UserProfile.currentProfileId,
			slug: UserProfile.currentProfileId
		};
	}

	save(): Promise<this> {
		return this.profileService.updateProfile(this.apiModel)
			.then(m => this.applyApiModel(m));
	}

	update() {
		return this.profileService.getProfile()
			.then(m => this.applyApiModel(m));
	}

	updatePassword(newPassword: string, currentPassword: string): Promise<this> {
		return this.profileService.updatePassword(newPassword, currentPassword)
			.then(() => this);
	}
}

