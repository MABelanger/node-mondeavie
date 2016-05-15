import React                          from "react";
import CourseName                     from "./courseName/admin";
import Teacher                        from "./teacher/admin";
import CourseDescription              from "./courseDescription/admin";
import CourseType                     from "./courseType/admin";
import Schedule                       from "./schedule/admin";
import FreeDay                        from "./freeDay/admin";
import BtnInfo                        from "../../commons/BtnInfo";

import * as sectionHelper             from "../helper";

// Flux CourseName
import CourseNameStore                from '../../../stores/course/courseNameStore';
import * as CourseNameActions         from '../../../actions/course/courseNameActions';

// Flux Teacher
import TeacherStore                   from '../../../stores/course/teacherStore';
import * as TeacherActions            from '../../../actions/course/teacherActions';

// Flux CourseDescription
import CourseDescriptionStore         from '../../../stores/course/courseDescriptionStore';
import * as CourseDescriptionActions  from '../../../actions/course/courseDescriptionActions';

// Flux CourseType
import CourseTypeStore                from '../../../stores/course/courseTypeStore';
import * as CourseTypeActions         from '../../../actions/course/courseTypeActions';

// Flux Schedule
import ScheduleStore                  from '../../../stores/course/scheduleStore';
import * as ScheduleActions           from '../../../actions/course/scheduleActions';

// Flux FreeDay
import FreeDayStore                  from '../../../stores/course/freeDayStore';
import * as FreeDayActions           from '../../../actions/course/freeDayActions';

const COURSE_NAME_LISTNER_FCT_NAMES = [
  { 
    storeFctAdd:'addListListener',
    storeFctRemove:'removeListListener',
    listenerFct: '_setCourseNames'
  },
  { 
    storeFctAdd:'addReadListener',
    storeFctRemove:'removeReadListener',
    listenerFct: '_getCourseName'
  },
  {
    storeFctAdd:'addDeletedListener',
    storeFctRemove:'removeDeletedListener',
    listenerFct: '_deletedCourseName'
  },
];

const TEACHER_LISTNER_FCT_NAMES = [
  { 
    storeFctAdd:'addListListener',
    storeFctRemove:'removeListListener',
    listenerFct: '_setTeachers'
  },
  { 
    storeFctAdd:'addReadListener',
    storeFctRemove:'removeReadListener',
    listenerFct: '_getTeacher'
  },
  {
    storeFctAdd:'addDeletedListener',
    storeFctRemove:'removeDeletedListener',
    listenerFct: '_deletedTeacher'
  },
];

const COURSE_DESCRIPTION_LISTNER_FCT_NAMES = [
  { 
    storeFctAdd:'addReadListener',
    storeFctRemove:'removeReadListener',
    listenerFct: '_getCourseDescription'
  },
  {
    storeFctAdd:'addDeletedListener',
    storeFctRemove:'removeDeletedListener',
    listenerFct: '_deletedCourseDescription'
  },
];

const COURSE_TYPE_LISTNER_FCT_NAMES = [
  { 
    storeFctAdd:'addListListener',
    storeFctRemove:'removeListListener',
    listenerFct: '_setCourseTypes'
  },
  { 
    storeFctAdd:'addReadListener',
    storeFctRemove:'removeReadListener',
    listenerFct: '_getCourseType'
  },
  {
    storeFctAdd:'addDeletedListener',
    storeFctRemove:'removeDeletedListener',
    listenerFct: '_deletedCourseType'
  },
];

const SCHEDULE_LISTNER_FCT_NAMES = [
  { 
    storeFctAdd:'addListListener',
    storeFctRemove:'removeListListener',
    listenerFct: '_setSchedules'
  },
  { 
    storeFctAdd:'addReadListener',
    storeFctRemove:'removeReadListener',
    listenerFct: '_getSchedule'
  },
  {
    storeFctAdd:'addDeletedListener',
    storeFctRemove:'removeDeletedListener',
    listenerFct: '_deletedSchedule'
  },
];

const FREE_DAY_LISTNER_FCT_NAMES = [
  { 
    storeFctAdd:'addListListener',
    storeFctRemove:'removeListListener',
    listenerFct: '_setFreeDays'
  },
  { 
    storeFctAdd:'addReadListener',
    storeFctRemove:'removeReadListener',
    listenerFct: '_getFreeDay'
  },
  {
    storeFctAdd:'addDeletedListener',
    storeFctRemove:'removeDeletedListener',
    listenerFct: '_deletedFreeDay'
  },
];

export default class CourseAdmin extends React.Component {

  constructor(props) {
    super(props);
    this.mounted = false;
    this.courseNameListnerFctRemoveNames = null;
    this.teacherListnerFctRemoveNames = null;
    this.courseDescriptionListnerFctRemoveNames = null;
    this.courseTypeListnerFctRemoveNames = null;
    this.scheduleListnerFctRemoveNames = null;
    this.freeDayListnerFctRemoveNames = null;

    this.state = {
      courses : [],
      course : {},

      teachers: [],
      teacher : {},

      courseDescription: {},

      courseTypes: [],
      courseType : {},

      schedules: [],
      schedule : {},

      freeDays: [],
      freeDay : {},

    };
  }

  componentDidMount() {
    this.mounted = true;
    // CourseName
    this.courseNameListnerFctRemoveNames = 
      sectionHelper.addListeners(CourseNameStore, COURSE_NAME_LISTNER_FCT_NAMES, this);

    // Teacher
    this.teacherListnerFctRemoveNames = 
      sectionHelper.addListeners(TeacherStore, TEACHER_LISTNER_FCT_NAMES, this);

    // CourseDescription
    this.courseDescriptionListnerFctRemoveNames = 
      sectionHelper.addListeners(CourseDescriptionStore, COURSE_DESCRIPTION_LISTNER_FCT_NAMES, this);

    // CourseType
    this.courseTypeListnerFctRemoveNames = 
      sectionHelper.addListeners(CourseTypeStore, COURSE_TYPE_LISTNER_FCT_NAMES, this);

    // Schedule
    this.scheduleListnerFctRemoveNames = 
      sectionHelper.addListeners(ScheduleStore, SCHEDULE_LISTNER_FCT_NAMES, this);

    // FreeDay
    this.freeDayListnerFctRemoveNames = 
      sectionHelper.addListeners(FreeDayStore, FREE_DAY_LISTNER_FCT_NAMES, this);

  }

  componentWillUnmount() {
    this.mounted = false;
    // CourseName
    sectionHelper.removeListeners(CourseNameStore, this.courseNameListnerFctRemoveNames);

    // Teacher
    sectionHelper.removeListeners(TeacherStore, this.teacherListnerFctRemoveNames);

    // CourseDescription
    sectionHelper.removeListeners(CourseDescriptionStore, this.courseDescriptionListnerFctRemoveNames);

    // CourseType
    sectionHelper.removeListeners(CourseTypeStore, this.courseTypeListnerFctRemoveNames);

    // Schedule
    sectionHelper.removeListeners(ScheduleStore, this.scheduleListnerFctRemoveNames);

    // FreeDay
    sectionHelper.removeListeners(FreeDayStore, this.freeDayListnerFctRemoveNames);
  }

  /*
   * Course
   */

  _deletedCourseName(){
    this._getCourse();
  }

  _getCourseName(){
    this.setCourse(CourseNameStore.getCourseName());
  }

  _setCourseNames(){
    this.setState({'courses': CourseNameStore.getCourseNames()});
  }

  setCourse(course){
    this.setState({'course': course}, function(){
      this._resetTeachers();
    });
  }

  renderCourseName(){
    return(
      <div>
        <CourseName
          ref="courseNameAdmin"
          course={this.state.course}
          courses={this.state.courses}
          setCourse={this.setCourse.bind(this)}
        />
        <hr/>
      </div>
    );
  }


  /*
   * Teacher
   */
  _resetTeachers(){
    this.setState({'teacher': {}}, function(){
      if(this.refs.teacherAdmin) {
        TeacherActions.getTeachers(this.state.course._id);
        this.refs.teacherAdmin.refs.teacherSection.hideSection();
      }
      this._resetCourseDescription();
    });
  }

  _deletedTeacher(){
    this._getTeacher();
  }

  _getTeacher(){
    this.setTeacher(TeacherStore.getTeacher());
  }

  _setTeachers(){
    this.setState( {'teachers': TeacherStore.getTeachers()} );
  }


  setTeacher(teacher){
    this.setState({'teacher': teacher}, function(){
      this._resetCourseDescription();
    });
  }

  renderTeacher(){
    return (
      <div>
        <Teacher
          ref="teacherAdmin"
          courseId={this.state.course._id}
          teacher={this.state.teacher}
          teachers={this.state.teachers}
          setTeacher={this.setTeacher.bind(this)}
          />
        <hr/>
      </div>
    );
  }

  /*
   * CourseDescription
   */
  _resetCourseDescription() {
    // update the course description and hide sections
    // need an if because the component is not
    this.setState({'courseDescription': {}}, function(){
      if ( this.refs.courseDescriptionAdmin ) {
        CourseDescriptionActions.getCourseDescription(this.state.course._id, this.state.teacher._id);
        //this.refs.courseDescriptionAdmin.read( this.state.course._id, this.state.teacher._id );
        this.refs.courseDescriptionAdmin.refs.courseDescriptionSection.hideSection();
      }
      this._resetCourseType();
    });
  }

  _deletedCourseDescription(){
    this._getCourseDescription();
  }

  _getCourseDescription(){
    this.setCourseDescription(CourseDescriptionStore.getCourseDescription());
  }


  setCourseDescription(courseDescription) {
    this.setState({'courseDescription': courseDescription}, function(){
      this._resetCourseType();
    });
  }

  renderCourseDescription(){
    return (
      <div>
        <CourseDescription
          ref="courseDescriptionAdmin"
          courseDescription={ this.state.courseDescription }
          setCourseDescription={this.setCourseDescription.bind(this)}
          courseId={this.state.course._id}
          teacherId={this.state.teacher._id}
        />
        <hr/>
      </div>
    );
  }


  /*
   * CourseType
   */
  _resetCourseType() {

    this.setState({'courseType': {} }, function(){
      if ( this.refs.courseTypeAdmin ) {
        CourseTypeActions.getCourseTypes(this.state.course._id, this.state.teacher._id);
        this.refs.courseTypeAdmin.refs.courseTypeSection.hideSection();
      }
      this._resetSchedule();
    });
  }

  _deletedCourseType(){
    this._getCourseType();
  }

  _getCourseType(){
    this.setCourseType(CourseTypeStore.getCourseType());
  }

  _setCourseTypes(){
    this.setState( {'courseTypes': CourseTypeStore.getCourseTypes()} );
  }

  setCourseType(courseType){
    this.setState({'courseType': courseType}, function(){
      this._resetSchedule();
    });
  }

  setCourseTypes(courseTypes){
    this.setState({'courseTypes': courseTypes});
  }

  renderCourseType(){
    return (
      <div>
        <CourseType
          ref="courseTypeAdmin"
          setCourseType={this.setCourseType.bind(this)}
          setCourseTypes={this.setCourseTypes.bind(this)}
          courseType={ this.state.courseType }
          courseTypes={ this.state.courseTypes }
          courseId={this.state.course._id}
          teacherId={this.state.teacher._id}
        />
        <hr/>
      </div>
    );
  }


  /*
   * Schedule
   */
  _resetSchedule(){
    this.setState({'schedule': {} }, function(){
      if (this.refs.scheduleAdmin) {
        ScheduleActions.getSchedules(
            this.state.course._id,
            this.state.teacher._id,
            this.state.courseType._id
        );
        this.refs.scheduleAdmin.refs.scheduleSection.hideSection();
      }
      this._resetFreeDay();
    });
  }

  _deletedSchedule(){
    this._getSchedule();
  }

  _getSchedule(){
    this.setSchedule(ScheduleStore.getSchedule());
  }

  _setSchedules(){
    this.setState( {'schedules': ScheduleStore.getSchedules()} );
  }

  setSchedule(schedule){
    this.setState({'schedule': schedule}, function(){
      this._resetFreeDay();
    });
    
  }

  setSchedules(schedules){
    this.setState({'schedules': schedules});
  }

  renderSchedule(){
    return (
      <div>
        <Schedule
          ref="scheduleAdmin"
          setSchedule={this.setSchedule.bind(this)}
          setSchedules={this.setSchedules.bind(this)}
          schedule={ this.state.schedule }
          schedules={ this.state.schedules }
          courseId={this.state.course._id}
          teacherId={this.state.teacher._id}
          courseTypeId={this.state.courseType._id}
          />
        <hr/>
      </div>
    );
  }

  /*
   * Testing Day
   */
  _resetFreeDay(){
    this.setState({'freeDay': {} }, function(){
      if (this.refs.freeDayAdmin) {
        FreeDayActions.getFreeDays(
            this.state.course._id,
            this.state.teacher._id,
            this.state.courseType._id,
            this.state.schedule._id
          );
        this.refs.freeDayAdmin.refs.freeDaySection.hideSection();
      }
    });
  }

  _deletedFreeDay(){
    this._getFreeDay();
  }

  _getFreeDay(){
    this.setFreeDay(FreeDayStore.getFreeDay());
  }

  _setFreeDays(){
    this.setState( {'freeDays': FreeDayStore.getFreeDays()} );
  }

  setFreeDay(freeDay){
    this.setState({'freeDay': freeDay});
  }

  setFreeDays(freeDays){
    this.setState({'freeDays': freeDays});
  }

  renderFreeDay(){
    return (
      <div>
        <FreeDay
          ref="freeDayAdmin"
          setFreeDay={this.setFreeDay.bind(this)}
          setFreeDays={this.setFreeDays.bind(this)}
          freeDay={ this.state.freeDay }
          freeDays={ this.state.freeDays }
          courseId={this.state.course._id}
          teacherId={this.state.teacher._id}
          courseTypeId={this.state.courseType._id}
          scheduleId={this.state.schedule._id}
          />
        <hr/>
      </div>
    );
  }

  /*
   * Render all sections
   */
  render() {
    return (
      <div>
        { this.renderCourseName() }
        { this.state.course._id ? this.renderTeacher() : '' }
        { this.state.teacher._id ? this.renderCourseDescription() : '' }
        { (this.state.courseDescription && this.state.courseDescription.courseType) ? this.renderCourseType() : '' }
        { this.state.courseType._id ? this.renderSchedule() : '' }
        { this.state.schedule._id ? this.renderFreeDay() : '' }
      </div>
    );
  }
}

