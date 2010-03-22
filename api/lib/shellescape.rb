unless "".respond_to?(:shellescape)
  class String
    # Copied from Ruby 1.9's Shellwords implementation.
    # See http://svn.ruby-lang.org/repos/ruby/trunk/lib/shellwords.rb
    def shellescape
      # An empty argument will be skipped, so return empty quotes.
      return "''" if empty?

      str = dup

      # Process as a single byte sequence because not all shell
      # implementations are multibyte aware.
      str.gsub!(/([^A-Za-z0-9_\-.,:\/@\n])/n, "\\\\\\1")

      # A LF cannot be escaped with a backslash because a backslash + LF
      # combo is regarded as line continuation and simply ignored.
      str.gsub!(/\n/, "'\n'")

      return str
    end
  end
end
