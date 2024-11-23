import {ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, Signal, signal} from '@angular/core';
import {UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators} from "@angular/forms";
import {takeUntilDestroyed, toSignal} from "@angular/core/rxjs-interop";
import {
  AnonymousConsent,
  AnonymousConsentsConfig,
  AnonymousConsentsService, AuthConfigService, ConsentTemplate,
  FeatureConfigService, GlobalMessageEntities,
  GlobalMessageService, GlobalMessageType, isNotUndefined, OAuthFlow,
  RoutingService, Title
} from "@spartacus/core";
import {CustomFormValidators, sortTitles} from "@spartacus/storefront";
import {RegisterComponentService} from "@spartacus/user/profile/components";
import {UserSignUp} from "@spartacus/user/profile/root";
import {combineLatest, filter, map} from "rxjs";
import {StValidators} from "../../core";

@Component({
  selector: 'st-register',
  templateUrl: './st-register.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StRegisterComponent implements OnInit {

  private featureConfigService = inject(FeatureConfigService);
  protected passwordValidators = this.featureConfigService?.isEnabled(
    'formErrorsDescriptiveMessages'
  )
    ? this.featureConfigService.isEnabled(
      'enableConsecutiveCharactersPasswordRequirement'
    )
      ? [
        ...CustomFormValidators.passwordValidators,
        StValidators.noConsecutiveCharacters,
      ]
      : CustomFormValidators.passwordValidators
    : [
      this.featureConfigService.isEnabled(
        'enableConsecutiveCharactersPasswordRequirement'
      )
        ? StValidators.strongPasswordValidator
        : CustomFormValidators.passwordValidator,
    ];
  private registerConsent = this.anonymousConsentsConfig?.anonymousConsents?.registerConsent ?? '';
  readonly isLoading = signal<boolean>(false);
  readonly titles: Signal<Title[]> = toSignal<Title[]>(this.registerComponentService.getTitles().pipe(
    map((titles: Title[]) => {
      return titles?.length > 0 ? titles.sort(sortTitles) : [];
    }),
    filter(isNotUndefined)
  )) as Signal<Title[]>;
  readonly anonymousConsent = toSignal<{
    consent?: AnonymousConsent;
    template?: string;
  }>(combineLatest([
    this.anonymousConsentsService.getConsent(this.registerConsent),
    this.anonymousConsentsService.getTemplate(this.registerConsent),
  ]).pipe(
    map(([consent, template]: [AnonymousConsent | undefined, ConsentTemplate | undefined]) => {
      return {
        consent,
        template: template?.description ? template.description : '',
      };
    })
  ));

  registerForm: UntypedFormGroup = this.fb.group(
    {
      titleCode: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, CustomFormValidators.emailValidator]],
      password: ['', [Validators.required, ...this.passwordValidators]],
      passwordconf: ['', Validators.required],
      newsletter: new UntypedFormControl({
        value: false,
        disabled: this.isConsentRequired(),
      }),
      additionalConsents:
        this.registerComponentService.generateAdditionalConsentsFormControl?.() ??
        this.fb.array([]),
      termsandconditions: [false, Validators.requiredTrue],
    },
    {
      validators: CustomFormValidators.passwordsMustMatch(
        'password',
        'passwordconf'
      ),
    }
  );
  additionalRegistrationConsents: {
    template: ConsentTemplate;
    required: boolean;
  }[] = this.registerComponentService?.getAdditionalConsents() || [];

  get additionalConsents(): UntypedFormArray {
    return this.registerForm?.get('additionalConsents') as UntypedFormArray;
  }

  constructor(
    protected globalMessageService: GlobalMessageService,
    protected fb: UntypedFormBuilder,
    protected router: RoutingService,
    protected anonymousConsentsService: AnonymousConsentsService,
    protected anonymousConsentsConfig: AnonymousConsentsConfig,
    protected authConfigService: AuthConfigService,
    protected registerComponentService: RegisterComponentService,
    protected destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.globalMessageService
      .get()
      .pipe(filter((messages) => !!Object.keys(messages).length), takeUntilDestroyed(this.destroyRef))
      .subscribe((globalMessageEntities: GlobalMessageEntities) => {
        const messages =
          globalMessageEntities &&
          globalMessageEntities[GlobalMessageType.MSG_TYPE_ERROR];

        if (
          messages &&
          messages.some(
            (message) => message.raw === 'This field is required.'
          )
        ) {
          this.globalMessageService.remove(GlobalMessageType.MSG_TYPE_ERROR);
          this.globalMessageService.add(
            { key: 'register.titleRequired' },
            GlobalMessageType.MSG_TYPE_ERROR
          );
        }
      })
  }

  isConsentGiven(consent?: AnonymousConsent): boolean {
    return this.anonymousConsentsService.isConsentGiven(consent);
  }

  submitForm(): void {
    if (this.registerForm.valid) {
      this.registerUser();
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  updateAdditionalConsents(event: MouseEvent, index: number) {
    const { checked } = event.target as HTMLInputElement;
    this.registerForm.value.additionalConsents[index] = checked;
  }

  private registerUser(): void {
    this.isLoading.set(true);
    this.registerComponentService
      .register(this.collectDataFromRegisterForm(this.registerForm.value))
      .subscribe({
        next: () => this.onRegisterUserSuccess(),
        complete: () => this.isLoading.set(false),
        error: () => this.isLoading.set(false),
      });
  }

  private collectDataFromRegisterForm(formData: any): UserSignUp {
    const { firstName, lastName, email, password, titleCode } = formData;
    return {
      firstName,
      lastName,
      uid: email.toLowerCase(),
      password,
      titleCode,
    };
  }

  private onRegisterUserSuccess(): void {
    if (
      this.authConfigService.getOAuthFlow() ===
      OAuthFlow.ResourceOwnerPasswordFlow
    ) {
      this.router.go('login');
    }
    this.registerComponentService.postRegisterMessage();
  }

  private isConsentRequired(): boolean {
    const requiredConsents =
      this.anonymousConsentsConfig?.anonymousConsents?.requiredConsents;
    const registerConsent =
      this.anonymousConsentsConfig?.anonymousConsents?.registerConsent;
    if (requiredConsents && registerConsent) {
      return requiredConsents.includes(registerConsent);
    }
    return false;
  }
}
