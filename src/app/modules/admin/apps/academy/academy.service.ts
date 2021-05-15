import { environment } from 'environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Category, Course } from 'app/modules/admin/apps/academy/academy.types';

@Injectable({
    providedIn: 'root'
})
export class AcademyService
{
    // Private
    private _categories: BehaviorSubject<Category[] | null> = new BehaviorSubject(null);
    private _course: BehaviorSubject<Course | null> = new BehaviorSubject(null);
    private _courses: BehaviorSubject<Course[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for categories
     */
    guardarDocumento(id,steps){
        let params={
            steps:steps
        }
        return this._httpClient.post(environment._apiUrl+"documentos/"+id,params).toPromise();
    }
    getTipoDocumentos(){
        return this._httpClient.get(environment._apiUrl+'documentos/tipos').toPromise();
    }
    saveCasoDocumento(id_caso,id_tipodoc,nota){
        let params={
            id_caso:id_caso,
            id_tipodoc:id_tipodoc,
            nota:nota
        }
        return this._httpClient.post(environment._apiUrl+'documentos',params).toPromise();
    }
    getCasoDocumentos(id){
        return this._httpClient.get(environment._apiUrl+'documentos/casos/'+id).toPromise();
    }
    updateProgreso(id,progreso){
        let params={
            id:id,
            progreso:progreso
        }
        console.log(params);
        return this._httpClient.post(environment._apiUrl+'documentos/updateprogreso',params).toPromise();
    }
    getEstructuraTemplate(id){
        return this._httpClient.get(environment._apiUrl+'documentos/estructura/'+id).toPromise();
    }
    get categories$(): Observable<Category[]>
    {
        return this._categories.asObservable();
    }

    /**
     * Getter for courses
     */
    get courses$(): Observable<Course[]>
    {
        return this._courses.asObservable();
    }

    /**
     * Getter for course
     */
    get course$(): Observable<Course>
    {
        return this._course.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get categories
     */
    getCategories(): Observable<Category[]>
    {
        return this._httpClient.get<Category[]>('api/apps/academy/categories').pipe(
            tap((response: any) => {
                this._categories.next(response);
            })
        );
    }

    /**
     * Get courses
     */
    getCourses(): Observable<Course[]>
    {
        return this._httpClient.get<Course[]>('api/apps/academy/courses').pipe(
            tap((response: any) => {
                this._courses.next(response);
            })
        );
    }

    /**
     * Get course by id
     */
    getCourseById(id: string): Observable<Course>
    {
        return this._httpClient.get<Course>('api/apps/academy/courses/course', {params: {id}}).pipe(
            tap((response: any) => {
                this._course.next(response);
            })
        );
    }
}
