set :application, "nhs-injection-api"
set :repository, "git://github.com/gma/nhs-injection-api.git"
set :revision, "origin/nhs-injection-api"
set :user, "deploy"
set :domain, "#{user}@fig.effectif.com"
set :deploy_to, "/var/apps/#{application}"

# ============================================================================
# You don't need to worry about anything beneath this point...
# ============================================================================

require "tempfile"
require "vlad"

namespace :vlad do
  remote_task :config_yml do
    put "#{shared_path}/config.yml", "vlad.config.yml" do
      File.open(File.join(File.dirname(__FILE__), "config.yml")).read
    end
    run "chmod 664 #{shared_path}/config.yml"
  end
  
  task :setup do
    Rake::Task['vlad:config_yml'].invoke
  end
  
  remote_task :symlink_config_yml do
    run "ln -s #{shared_path}/config.yml #{current_path}/config/config.yml"
  end
  
  remote_task :symlink_attachments do
    run "ln -s #{shared_path}/content/attachments #{current_path}/public/attachments"
  end
  
  task :update do
    [:symlink_config_yml, :symlink_attachments].each do |task|
      Rake::Task["vlad:#{task}"].invoke
    end
    run "sudo chown app:deploy #{current_path}/config.ru"
    run "sudo chown -R #{current_path}/config/config.yml"
    run "sudo chown -R #{current_path}/config/content"
  end
  
  remote_task :start_app do
    run "touch #{current_path}/tmp/restart.txt"
  end
  
  desc "Deploy the code and restart the server"
  task :deploy => [:update, :start_app]
end
