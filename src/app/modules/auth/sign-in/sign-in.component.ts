import { User } from './../../../core/user/user.model';
import { UserService } from './../../../core/user/user.service';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : FuseAnimations
})
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType, message: string } = {
        type   : 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _userService:UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.signInForm = this._formBuilder.group({
            email     : ['carlosjsanchezc@gmail.com', [Validators.required, Validators.email]],
            password  : ['123456', Validators.required],
            rememberMe: ['']
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void
    {
        // Return if the form is invalid
        if ( this.signInForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        

        this._authService.signIn2(this.signInForm.value).then(data=>{
                    let response:any=data;
                    //console.log(response.user);
                    // Store the access token in the local storage
                    this._authService.accessToken = response.user.api_token;
    
                    // Set the authenticated flag to true
                    this._authService._authenticated = "true";
    
                    // Store the user on the user service
                    console.log(response.user.email);
                    //console.log(this._userService.user.email);
                    let UserLogged=
                    {
                        id: response.user.id,
                        name: response.user.name,
                        email: response.user.email,
                        avatar: '',
                        status: 'online',
                    }
                    ;
                    console.log(UserLogged);
                    this._userService.user=UserLogged;
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                    this._userService.myUser=UserLogged;
                    
                    console.log(this._userService.user);
                    this._router.navigateByUrl(redirectURL);

                }).catch(error=>{
                    console.log("Error",error);
                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Wrong email or password'
                    };

                    // Show the alert
                    this.showAlert = true;
                })


    }
}
