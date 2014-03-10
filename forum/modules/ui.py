

class Registry(list):
    def add(self, item):
        for i, r in enumerate(self):
            if r.weight > item.weight:
                self.insert(i, item)
                return

        self.append(item)

    def find_by_name(self, name):
        for i in self:
            if i.name and (i.name == name):
                return i

    def remove_by_name(self, name):
        for i, r in enumerate(self):
            if r.name and (r.name == name):
                return self.pop(i)


HEAD_CONTENT = 'HEAD_CONTENT'
LOGIN_OUT = 'LOGIN_OUT'
USERNAME_SCORE_BADGE = 'USERNAME_SCORE_BADGE'
ADMIN_SUPERUSER = 'ADMIN_SUPERUSER'
FOOTER_LINKS = 'FOOTER_LINKS'
PROFILE_TABS = 'PROFILE_TABS'

USER_MENU = 'USER_MENU'


__CONTAINER = {
    HEAD_CONTENT: Registry(),
    LOGIN_OUT: Registry(),
    USERNAME_SCORE_BADGE: Registry(),
    ADMIN_SUPERUSER: Registry(),
    FOOTER_LINKS: Registry(),
    PROFILE_TABS: Registry(),

    USER_MENU: Registry(),
}


def register(registry, *ui_objects):
    if not registry in __CONTAINER:
        raise('unknown registry')

    for ui_object in ui_objects:
        __CONTAINER[registry].add(ui_object)

def get_registry_by_name(name):
    name = name.upper()

    if not name in __CONTAINER:
        raise('unknown registry')

    return __CONTAINER[name]



from ui_objects import *

