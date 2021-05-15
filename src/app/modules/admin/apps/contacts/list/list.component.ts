import { UserService } from 'app/core/user/user.service';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { Contact, Country } from 'app/modules/admin/apps/contacts/contacts.types';
import { ContactsService } from 'app/modules/admin/apps/contacts/contacts.service';

@Component({
    selector       : 'contacts-list',
    templateUrl    : './list.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactsListComponent implements OnInit, OnDestroy
{
    @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;

    contacts$: Observable<Contact[]>;

    contactsCount: number = 0;
    contactsTableColumns: string[] = ['name', 'email', 'phoneNumber', 'job'];
    countries: Country[];
    drawerMode: 'side' | 'over';
    searchInputControl: FormControl = new FormControl();
    selectedContact: Contact;
    myContacts:any=[];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        public _changeDetectorRef: ChangeDetectorRef,
        private _contactsService: ContactsService,
        @Inject(DOCUMENT) private _document: any,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _usersService:UserService
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
        // Get the contacts
        this._usersService.user$.subscribe(data=>{
           // console.log(data);
        })
        this._contactsService.getContacts().subscribe(data=>{
            this.myContacts=data;
            console.log("My Contacts:",this.myContacts.length);
            this.contactsCount=this.myContacts.length;
            this._changeDetectorRef.markForCheck();
           
        })

        // Get the countries
        this._contactsService.countries$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((countries: Country[]) => {

                // Update the countries
                this.countries = countries;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                switchMap((query) => {

                    // Search
                    return this._contactsService.searchContacts(query);
                })
            )
            .subscribe();

        // Subscribe to MatDrawer opened change
        this.matDrawer.openedChange.subscribe((opened) => {
            console.log("Volvio opener");
            if ( !opened )
            {
                // Remove the selected contact when drawer closed
                this.selectedContact = null;

                // Mark for check
                this._changeDetectorRef.markForCheck();
            }
        });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Set the drawerMode if the given breakpoint is active
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                }
                else
                {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Listen for shortcuts
        fromEvent(this._document, 'keydown')
            .pipe(
                takeUntil(this._unsubscribeAll),
                filter<KeyboardEvent>((event) => {
                    return (event.ctrlKey === true || event.metaKey) // Ctrl or Cmd
                        && (event.key === '/'); // '/'
                })
            )
            .subscribe(() => {
                this.createContact();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Go to contact
     *
     * @param id
     */
    goToContact(id: string): void
    {
        // Get the current activated route
        this._changeDetectorRef.markForCheck();
        console.log(this.myContacts);
        let route = this._activatedRoute;
        while ( route.firstChild )
        {
            route = route.firstChild;
        }

        // Go to contact
        this._router.navigate(['../', id], {relativeTo: route});

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
    
    goToDocuments(id: string): void
    {
        // Get the current activated route
        console.log("Go to documents:",id);
        //this._changeDetectorRef.markForCheck();
        //console.log(this.myContacts);
        let route = this._activatedRoute;


        // Go to contact
        this._router.navigate(['documents', id], {relativeTo: route});

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void
    {
        // Get the current activated route
        console.log("Volvio");

        let route = this._activatedRoute;
        while ( route.firstChild )
        {
            route = route.firstChild;
        }
        
        // Go to the parent route
        this._router.navigate(['../'], {relativeTo: route});

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }

    /**
     * Create contact
     */
    createContact(): void
    {
        // Create the contact
        this._contactsService.createContact().subscribe((newContact) => {

            // Go to new contact
            console.log(newContact);
            this.goToContact(newContact.id);
            this.ngOnInit();
        });
    }

    /**
     * Get country code
     *
     * @param iso
     */
    getCountryCode(iso: string): string
    {
        if ( !iso )
        {
            return '';
        }

        return this.countries.find((country) => country.iso === iso).code;
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }
    checknewLetra(i){
        if (i===0) return true;
        if (this.myContacts[i].name.charAt(0)!==this.myContacts[i-1].name.charAt(0)) return true;
        return false;
    }
    char1(str:string){
        
        return str.substr(0,1);
    }
}
