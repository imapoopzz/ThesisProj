import { useState } from 'react';
import { Save, Info, AlertTriangle, Bot, Shield, Settings2, Database } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';

interface AISettingsState {
  confidenceThreshold: number;
  autoAssignEnabled: boolean;
  autoGenerateResponses: boolean;
  model: string;
  tokenLimit: number;
  webhookUrl: string;
  debugMode: boolean;
  redactionPolicy: string;
  activeLearningEnabled: boolean;
  samplingRate: number;
  sensitiveCategories: string[];
}

const DEFAULT_SETTINGS: AISettingsState = {
  confidenceThreshold: 0.85,
  autoAssignEnabled: true,
  autoGenerateResponses: true,
  model: 'gpt-4',
  tokenLimit: 4000,
  webhookUrl: 'https://webhook.n8n.cloud/webhook/ai-triage',
  debugMode: false,
  redactionPolicy: 'strict',
  activeLearningEnabled: true,
  samplingRate: 10,
  sensitiveCategories: ['Legal - Complex', 'Medical - Rare', 'Emergency - Critical']
};

export function AISettings() {
  const [settings, setSettings] = useState<AISettingsState>(DEFAULT_SETTINGS);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastModified, setLastModified] = useState('2025-09-29T14:30:00Z');

  const updateSetting = (key: keyof AISettingsState, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleSaveSettings = () => {
    // Simulate API call
    console.log('Saving AI settings:', settings);
    setHasUnsavedChanges(false);
    setLastModified(new Date().toISOString());
    toast.success("AI settings saved successfully");
  };

  const handleResetToDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    setHasUnsavedChanges(true);
    toast.info("Settings reset to defaults");
  };

  const redactionPolicies = {
    strict: {
      label: 'Strict',
      description: 'All PII redacted including names, IDs, addresses, phones, emails',
      categories: ['Names', 'ID Numbers', 'Addresses', 'Phone Numbers', 'Email Addresses', 'Medical Info']
    },
    moderate: {
      label: 'Moderate',
      description: 'Core PII redacted, some contextual info preserved',
      categories: ['Names', 'ID Numbers', 'Addresses', 'Phone Numbers']
    },
    minimal: {
      label: 'Minimal',
      description: 'Only highly sensitive data redacted',
      categories: ['ID Numbers', 'Medical Info']
    }
  };

  const availableModels = [
    { value: 'gpt-4', label: 'GPT-4', description: 'Most capable, higher cost' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', description: 'Faster, good performance' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', description: 'Fast, lower cost' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold">AI Settings & Controls</h2>
            <p className="text-sm text-muted-foreground">
              Configure AI automation behavior and safety controls
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <Badge variant="secondary">Unsaved changes</Badge>
          )}
          <Button variant="outline" onClick={handleResetToDefaults}>
            Reset Defaults
          </Button>
          <Button onClick={handleSaveSettings} disabled={!hasUnsavedChanges}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="automation" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="model">Model & API</TabsTrigger>
          <TabsTrigger value="privacy">Privacy & Redaction</TabsTrigger>
          <TabsTrigger value="learning">Active Learning</TabsTrigger>
        </TabsList>

        {/* Automation Settings */}
        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" />
                Automation Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Confidence Threshold */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2">
                    Confidence Threshold
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </Label>
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {settings.confidenceThreshold.toFixed(2)}
                  </span>
                </div>
                <Slider
                  value={[settings.confidenceThreshold]}
                  onValueChange={([value]) => updateSetting('confidenceThreshold', value)}
                  min={0.5}
                  max={1.0}
                  step={0.05}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.50 (Low)</span>
                  <span>0.85 (Recommended)</span>
                  <span>1.00 (High)</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Tickets with AI confidence above this threshold will be auto-assigned. 
                  Recommended: 0.85 for optimal balance of automation and accuracy.
                </p>
              </div>

              <Separator />

              {/* Auto-assign Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-assign when confidence ≥ threshold</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically assign tickets to suggested teams when AI confidence meets threshold
                  </p>
                </div>
                <Switch
                  checked={settings.autoAssignEnabled}
                  onCheckedChange={(checked) => updateSetting('autoAssignEnabled', checked)}
                />
              </div>

              {/* Auto-generate Responses */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Auto-generate response proposals</Label>
                  <p className="text-sm text-muted-foreground">
                    Generate draft responses for proponent review and approval
                  </p>
                </div>
                <Switch
                  checked={settings.autoGenerateResponses}
                  onCheckedChange={(checked) => updateSetting('autoGenerateResponses', checked)}
                />
              </div>

              {!settings.autoAssignEnabled && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Auto-assignment is disabled. All tickets will require manual review regardless of confidence level.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Model & API Settings */}
        <TabsContent value="model" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Model Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Model Selection */}
              <div className="space-y-3">
                <Label>AI Model</Label>
                <Select value={settings.model} onValueChange={(value) => updateSetting('model', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        <div>
                          <div className="font-medium">{model.label}</div>
                          <div className="text-xs text-muted-foreground">{model.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Token Limit */}
              <div className="space-y-3">
                <Label>Token Limit</Label>
                <Input
                  type="number"
                  value={settings.tokenLimit}
                  onChange={(e) => updateSetting('tokenLimit', parseInt(e.target.value))}
                  min={1000}
                  max={8000}
                />
                <p className="text-sm text-muted-foreground">
                  Maximum tokens per API call. Higher values allow for more context but increase cost.
                </p>
              </div>

              <Separator />

              {/* Webhook Configuration */}
              <div className="space-y-3">
                <Label>n8n Webhook URL</Label>
                <Input
                  type="url"
                  value={settings.webhookUrl}
                  onChange={(e) => updateSetting('webhookUrl', e.target.value)}
                  placeholder="https://webhook.n8n.cloud/webhook/..."
                />
                <p className="text-sm text-muted-foreground">
                  Webhook endpoint for n8n integration. URL is masked for security.
                </p>
              </div>

              {/* Debug Mode */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Debug Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable detailed logging for troubleshooting (increases log verbosity)
                  </p>
                </div>
                <Switch
                  checked={settings.debugMode}
                  onCheckedChange={(checked) => updateSetting('debugMode', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy & Redaction */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy & Redaction Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Redaction Policy */}
              <div className="space-y-3">
                <Label>Redaction Policy</Label>
                <Select 
                  value={settings.redactionPolicy} 
                  onValueChange={(value) => updateSetting('redactionPolicy', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(redactionPolicies).map(([key, policy]) => (
                      <SelectItem key={key} value={key}>
                        <div>
                          <div className="font-medium">{policy.label}</div>
                          <div className="text-xs text-muted-foreground">{policy.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <div className="p-3 border rounded-lg bg-gray-50">
                  <h4 className="text-sm font-medium mb-2">
                    Current Policy: {redactionPolicies[settings.redactionPolicy as keyof typeof redactionPolicies].label}
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {redactionPolicies[settings.redactionPolicy as keyof typeof redactionPolicies].categories.map((category) => (
                      <Badge key={category} variant="outline" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Sensitive Categories */}
              <div className="space-y-3">
                <Label>Always Require Human Review (Sensitive Categories)</Label>
                <p className="text-sm text-muted-foreground">
                  These categories will always be marked for human review regardless of confidence level
                </p>
                <Textarea
                  value={settings.sensitiveCategories.join(', ')}
                  onChange={(e) => updateSetting('sensitiveCategories', e.target.value.split(', ').filter(Boolean))}
                  placeholder="Legal - Complex, Medical - Rare, Emergency - Critical"
                  className="min-h-[80px]"
                />
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Privacy Notice:</strong> All redaction policies comply with data protection regulations. 
                  Original content requires explicit audit permission and all access is logged.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Learning */}
        <TabsContent value="learning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Active Learning Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Active Learning Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Enable Active Learning</Label>
                  <p className="text-sm text-muted-foreground">
                    Use admin overrides and corrections to improve AI model accuracy
                  </p>
                </div>
                <Switch
                  checked={settings.activeLearningEnabled}
                  onCheckedChange={(checked) => updateSetting('activeLearningEnabled', checked)}
                />
              </div>

              {settings.activeLearningEnabled && (
                <>
                  <Separator />
                  
                  {/* Sampling Rate */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Sampling Rate (%)</Label>
                      <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {settings.samplingRate}%
                      </span>
                    </div>
                    <Slider
                      value={[settings.samplingRate]}
                      onValueChange={([value]) => updateSetting('samplingRate', value)}
                      min={1}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-sm text-muted-foreground">
                      Percentage of override events to include in training data. Lower values reduce model training frequency.
                    </p>
                  </div>

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Active Learning:</strong> When enabled, admin overrides and corrections will be logged as training examples. 
                      This helps improve AI accuracy over time but may increase processing overhead.
                    </AlertDescription>
                  </Alert>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Last Modified Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Last modified: {new Date(lastModified).toLocaleString()} by Admin User
            </span>
            <Badge variant="outline">Production Environment</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}