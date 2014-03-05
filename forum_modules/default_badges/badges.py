from datetime import datetime, timedelta
from django.utils.translation import ugettext as _
from forum.badges.base import AbstractBadge
from forum.models import Badge
from forum.actions import *
from forum.models import Vote, Flag

import settings

class QuestionViewBadge(AbstractBadge):
    abstract = True
    listen_to = (QuestionViewAction,)

    @property
    def description(self):
        return _('Started a topic with %s views') % str(self.nviews)

    def award_to(self, action):
        if action.node.extra_count == int(self.nviews):
            return action.node.author


class NotableQuestion(QuestionViewBadge):
    type = Badge.SILVER
    name = _('5K views')
    nviews = settings.NOTABLE_QUESTION_VIEWS


class NodeScoreBadge(AbstractBadge):
    abstract = True
    listen_to = (VoteAction,)

    def award_to(self, action):
        if (action.node.node_type == self.node_type) and (action.node.score == int(self.expected_score)):
            return action.node.author


class QuestionScoreBadge(NodeScoreBadge):
    abstract = True
    node_type = "question"

    @property
    def description(self):
        return _('Topic voted up %s times') % str(self.expected_score)

class NiceQuestion(QuestionScoreBadge):
    expected_score = settings.NICE_QUESTION_VOTES_UP
    name = _("100x topic")

class GoodQuestion(QuestionScoreBadge):
    type = Badge.SILVER
    expected_score = settings.GOOD_QUESTION_VOTES_UP
    name = _("500x topic")

class GreatQuestion(QuestionScoreBadge):
    type = Badge.GOLD
    expected_score = settings.GREAT_QUESTION_VOTES_UP
    name = _("1K topic")


class AnswerScoreBadge(NodeScoreBadge):
    abstract = True
    node_type = "answer"

    @property
    def description(self):
        return _('Post voted up %s times') % str(self.expected_score)

class NiceAnswer(AnswerScoreBadge):
    expected_score = settings.NICE_ANSWER_VOTES_UP
    name = _("100x post")

class GoodAnswer(AnswerScoreBadge):
    type = Badge.SILVER
    expected_score = settings.GOOD_ANSWER_VOTES_UP
    name = _("500x post")

class GreatAnswer(AnswerScoreBadge):
    type = Badge.GOLD
    expected_score = settings.GREAT_ANSWER_VOTES_UP
    name = _("1K post")


class FirstActionBadge(AbstractBadge):
    award_once = True
    abstract = True

    def award_to(self, action):
        if (self.listen_to[0].objects.filter(user=action.user).count() == 1):
            return action.user
