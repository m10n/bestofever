from consumer import OpenIdAbstractAuthConsumer
from forum.authentication.base import ConsumerTemplateContext

class GoogleAuthConsumer(OpenIdAbstractAuthConsumer):
    def get_user_url(self, request):
        return 'https://www.google.com/accounts/o8/id'

class GoogleAuthContext(ConsumerTemplateContext):
    mode = 'BIGICON'
    type = 'DIRECT'
    weight = 200
    human_name = 'Google'
    icon = '/media/images/openid/google.gif'



#class YahooAuthConsumer(OpenIdAbstractAuthConsumer):
#    def get_user_url(self, request):
#        return 'http://me.yahoo.com/'

#class YahooAuthContext(ConsumerTemplateContext):
#    mode = 'BIGICON'
#    type = 'DIRECT'
#    weight = 300
#    human_name = 'Yahoo'
#    icon = '/media/images/openid/yahoo.gif'


#class OpenIdUrlAuthConsumer(OpenIdAbstractAuthConsumer):
#    pass

#class OpenIdUrlAuthContext(ConsumerTemplateContext):
#    mode = 'STACK_ITEM'
#    weight = 300
#    human_name = 'OpenId url'
#    stack_item_template = 'modules/openidauth/openidurl.html'
#    icon = '/media/images/openid/openid-inputicon.gif'
