from django.forms.models import ModelChoiceIterator, ModelMultipleChoiceField
from django.forms.fields import ChoiceField


class GroupedModelChoiceIterator(ModelChoiceIterator):
    def __init__(self, group_by, *args, **kwargs):
        self.group_by = group_by
        super().__init__(*args, **kwargs)

    def __iter__(self):
        if self.field.empty_label is not None:
            yield ("", self.field.empty_label)
        queryset = self.queryset.all()
        if not queryset._prefetch_related_lookups:
            queryset = queryset.iterator()

        choices = {}
        for obj in queryset:
            group_name = str(getattr(obj, self.group_by))
            if group_name not in choices:
                choices[group_name] = []
            choices[group_name].append(self.choice(obj))
        for group_name, choices in choices.items():
            yield group_name, tuple(choices)


class GroupedModelMultipleChoiceField(ModelMultipleChoiceField):
    def __init__(self, group_by, *args, **kwargs):
        self.group_by = group_by
        super().__init__(*args, **kwargs)

    def _get_choices(self):
        if hasattr(self, '_choices'):
            return self._choices
        return GroupedModelChoiceIterator(self.group_by, self)
    choices = property(_get_choices, ChoiceField._set_choices)
