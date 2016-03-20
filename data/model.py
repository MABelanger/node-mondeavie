class Teacher(models.Model):

class CourseName(models.Model):

class Course(models.Model):
    teacher = models.ForeignKey(Teacher)
    course_name = models.ForeignKey(CourseName, blank=True)
    unique_together = (("teacher", "course_name"),)

class Schedule(models.Model):
    course = models.ForeignKey(Course)


class DaySchedule(models.Model):
    schedule = models.ForeignKey(Schedule)
    day_name = models.ForeignKey(DayName)


class TestingDay(models.Model):
    day_schedule = models.ForeignKey(DaySchedule)


'''
Conference section
'''
class Speaker(models.Model):

class Conference(models.Model):
    speakers = models.ManyToManyField(Speaker, related_name='ConferenceSpeaker', blank=False, null=False)

class DayConference(models.Model):
    conference = models.ForeignKey(Conference)
