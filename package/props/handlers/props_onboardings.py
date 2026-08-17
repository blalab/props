from flask import current_app
from renglo.auth.auth_controller import AuthController
from renglo.common import load_config

class PropsOnboardings:
    def __init__(self):
        config = load_config()
        self.AUC = AuthController(config=config)
        self.bridge = {}
        
    def create_tool(self, portfolio, tool, handle, roles=None):
        action = 'create_tool'
        current_app.logger.debug('Installing Props tool in portfolio')
        
        role_catalog = roles if roles is not None else ['operator', 'admin']

        kwargs = {
            'name': tool,
            'handle': handle,
            'portfolio_id': portfolio,
            'roles': role_catalog
        }

        # If tool already exists, refresh roles
        existing = self.AUC.list_entity('tool', portfolio_id=portfolio)
        items = ((existing or {}).get('document') or {}).get('items') or []
        for item in items:
            if str(item.get('handle') or '') == handle:
                tool_id = item.get('_id')
                self.bridge['tool_id'] = tool_id
                update = self.AUC.update_entity(
                    'tool',
                    portfolio_id=portfolio,
                    tool_id=tool_id,
                    payload={'roles': role_catalog},
                )
                return {
                    'success': bool(update.get('success')),
                    'action': action,
                    'message': 'Tool roles catalog refreshed' if update.get('success') else 'Could not refresh tool roles',
                    'input': kwargs,
                    'output': update,
                }

        response = self.AUC.create_entity('tool', **kwargs)
        self.bridge['tool_id'] = response['document']['_id']

        if not response['success']:
            return {'success': False, 'action': action, 'message': 'Could not install tool', 'input': kwargs, 'output': response}
        return {'success': True, 'action': action, 'message': 'Tool installed', 'input': kwargs, 'output': response}

    def refresh_tree(self):
        action = "refresh_tree"
        response = self.AUC.refresh_tree()
        if not response['success']:
            return {'success': False, 'action': action, 'message': 'Tree could not be generated', 'input': [], 'output': response}
        return {'success': True, 'action': action, 'message': 'The tree has been generated', 'input': [], 'output': response}

    def run(self, payload):
        results = []
        
        existing_portfolio = payload.get('portfolio')
        if not existing_portfolio:
            return {'success': False, 'output': 'No portfolio selected'}

        # Step 1: Create the tool
        response_1 = self.create_tool(existing_portfolio, 'Props', 'props')
        results.append(response_1)
        if not response_1['success']: 
            return {'success': False, 'output': results}
        
        # Step 2: Refresh the tree so frontend gets updated
        response_2 = self.refresh_tree()
        results.append(response_2)
        if not response_2['success']: 
            return {'success': False, 'output': results}
        
        return {'success': True, 'message': 'run completed', 'input': payload, 'output': results}
