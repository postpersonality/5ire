import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogBody,
  Button,
  Field,
  Input,
  DialogActions,
  InputOnChangeData,
} from '@fluentui/react-components';
import { useTranslation } from 'react-i18next';
import { Dismiss24Regular } from '@fluentui/react-icons';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';

import 'highlight.js/styles/atom-one-light.css';
import { IMCPServer } from 'types/mcp';
import useMCPStore from 'stores/useMCPStore';
import useToast from 'hooks/useToast';

export default function OnetwotripServerSettingsDialog(options: {
  server: IMCPServer;
  open: boolean;
  setOpen: Function;
}) {
  const { t } = useTranslation();
  const { notifySuccess, notifyError } = useToast();
  const { server, open, setOpen } = options;
  const [jiraToken, setJiraToken] = useState('');
  const [bitbucketToken, setBitbucketToken] = useState('');
  const [confluenceToken, setConfluenceToken] = useState('');
  const [allureToken, setAllureToken] = useState('');
  const [figmaToken, setFigmaToken] = useState('');
  const [jiraProjects, setJiraProjects] = useState('');
  const [bitbucketRepos, setBitbucketRepos] = useState('');

  const { updateServer } = useMCPStore();

  const submit = useCallback(async () => {
    const newConfig = { ...server };
    newConfig.env = {
      ...newConfig.env,
      JIRA_TOKEN: jiraToken,
      BITBUCKET_TOKEN: bitbucketToken,
      CONFLUENCE_TOKEN: confluenceToken,
      ALLURE_TOKEN: allureToken,
      FIGMA_TOKEN: figmaToken,
      JIRA_ALLOWED_PROJECTS: jiraProjects,
      BITBUCKET_ALLOWED_REPOS: bitbucketRepos,
    };

    const ok = await updateServer(newConfig);
    if (ok) {
      setOpen(false);
      notifySuccess('Server saved successfully');
    } else {
      notifyError('Cannot update server');
    }
  }, [
    server,
    jiraToken,
    bitbucketToken,
    confluenceToken,
    allureToken,
    figmaToken,
    jiraProjects,
    bitbucketRepos,
  ]);

  useEffect(() => {
    if (open && server) {
      setJiraToken(server.env?.JIRA_TOKEN || '');
      setBitbucketToken(server.env?.BITBUCKET_TOKEN || '');
      setConfluenceToken(server.env?.CONFLUENCE_TOKEN || '');
      setAllureToken(server.env?.ALLURE_TOKEN || '');
      setFigmaToken(server.env?.FIGMA_TOKEN || '');
      setJiraProjects(server.env?.JIRA_ALLOWED_PROJECTS || '*');
      setBitbucketRepos(server.env?.BITBUCKET_ALLOWED_REPOS || '*');
    }
  }, [open, server]);

  return (
    <div>
      <Dialog open={open}>
        <DialogSurface mountNode={document.body.querySelector('#portal')}>
          <DialogBody>
            <DialogTitle
              action={
                <DialogTrigger action="close">
                  <Button
                    onClick={() => setOpen(false)}
                    appearance="subtle"
                    aria-label="close"
                    icon={<Dismiss24Regular />}
                  />
                </DialogTrigger>
              }
            >
              <div className="flex flex-start justify-start items-baseline gap-2">
                <span>{t('Tools.Edit')}</span>
                <span className="text-sm text-gray-500">
                  (Onetwotrip MCP Server)
                </span>
              </div>
            </DialogTitle>
            <DialogContent className="flex flex-col gap-4">
              <Field label="JIRA Token">
                <Input
                  value={jiraToken}
                  onChange={(_: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => setJiraToken(data.value)}
                />
              </Field>
              <Field label="Bitbucket Token">
                <Input
                  value={bitbucketToken}
                  onChange={(_: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => setBitbucketToken(data.value)}
                />
              </Field>
              <Field label="Confluence Token">
                <Input
                  value={confluenceToken}
                  onChange={(_: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => setConfluenceToken(data.value)}
                />
              </Field>
              <Field label="Allure Token">
                <Input
                  value={allureToken}
                  onChange={(_: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => setAllureToken(data.value)}
                />
              </Field>
              <Field label="Figma Token">
                <Input
                  value={figmaToken}
                  onChange={(_: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => setFigmaToken(data.value)}
                />
              </Field>
              <Field label="JIRA Allowed Projects">
                <Input
                  value={jiraProjects}
                  onChange={(_: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => setJiraProjects(data.value)}
                />
              </Field>
              <Field label="Bitbucket Allowed Repositories">
                <Input
                  value={bitbucketRepos}
                  onChange={(_: ChangeEvent<HTMLInputElement>, data: InputOnChangeData) => setBitbucketRepos(data.value)}
                />
              </Field>
            </DialogContent>
            <DialogActions>
              <Button appearance="subtle" onClick={() => setOpen(false)}>
                {t('Common.Cancel')}
              </Button>
              <Button type="submit" appearance="primary" onClick={submit}>
                {t('Common.Save')}
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </div>
  );
}
