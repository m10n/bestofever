from forum.settings import BADGES_SET
from forum.settings.base import Setting
from django.utils.translation import ugettext_lazy as _


NICE_ANSWER_VOTES_UP = Setting('NICE_ANSWER_VOTES_UP', 10, BADGES_SET, dict(
label = _("Nice Answer up votes"),
help_text = _("""
Number of up votes required to award a Nice Answer badge to the answer author
""")))

NICE_QUESTION_VOTES_UP = Setting('NICE_QUESTION_VOTES_UP', 10, BADGES_SET, dict(
label = _("Nice Question up votes"),
help_text = _("""
Number of up votes required to award a Nice Question badge to the question author
""")))

GOOD_ANSWER_VOTES_UP = Setting('GOOD_ANSWER_VOTES_UP', 25, BADGES_SET, dict(
label = _("Good Answer up votes"),
help_text = _("""
Number of up votes required to award a Good Answer badge to the answer author
""")))

GOOD_QUESTION_VOTES_UP = Setting('GOOD_QUESTION_VOTES_UP', 25, BADGES_SET, dict(
label = _("Good Question up votes"),
help_text = _("""
Number of up votes required to award a Good Question badge to the question author
""")))

NOTABLE_QUESTION_VIEWS = Setting('NOTABLE_QUESTION_VIEWS', 2500, BADGES_SET, dict(
label = _("Notable Question views"),
help_text = _("""
Number of question views required to award a Notable Question badge to the question author
""")))



GREAT_ANSWER_VOTES_UP = Setting('GREAT_ANSWER_VOTES_UP', 100, BADGES_SET, dict(
label = _("Great Answer up votes"),
help_text = _("""
Number of up votes required to award a Great Answer badge to the answer author
""")))

GREAT_QUESTION_VOTES_UP = Setting('GREAT_QUESTION_VOTES_UP', 100, BADGES_SET, dict(
label = _("Great Question up votes"),
help_text = _("""
Number of up votes required to award a Great Question badge to the question author
""")))
