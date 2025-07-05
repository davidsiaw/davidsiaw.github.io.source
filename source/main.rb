require 'active_support/core_ext/date_time'

def create_page(inf:, path:, title:, &block)

  sidenav_page path, title, theme: :dark do

    request_js 'js/highlight.min.js'
    request_css 'css/dracula.css'
    request_css 'css/ourown.css'

    brand 'Home'

    menu do

      cats_open = false
      inf[:categories].each do |k, v|
        if "/#{path}" == "/categories/#{k}"
          cats_open = true
        end
      end

      nav 'Categories', :folder, '', open: cats_open do
        inf[:categories].each do |k, v|
          if "#{path}" == "categories/#{k}"
            nav k, :'folder-open', "/categories/#{k}"
          else
            nav k, :'folder', "/categories/#{k}"
          end
        end
      end

      history_open = false
      inf[:history].each do |k, v|
        if "/#{path}" == "/#{k}"
          history_open = true
        elsif path.start_with?(k)
          history_open = true
        end
      end

      nav 'History', :calendar, '', open: history_open do
        inf[:history].each do |k, v|
          if "/#{path}" == "/#{k}"
            nav "#{k} (#{v.length})", :'calendar-check-o', "/#{k}"
          elsif path.start_with?(k)
            nav "#{k} (#{v.length}) <br><i class='fa fa-chevron-right'></i>#{title}", :'calendar-check-o', "/#{k}"
          else
            nav "#{k} (#{v.length})", :'calendar-o', "/#{k}"
          end
        end
      end

      tags_open = false
      inf[:tags].each do |k, v|
        if "/#{path}" == "/tags/#{k}"
          tags_open = true
        end
      end

      nav 'Tags', :tags, '', open: tags_open do
        inf[:tags].each do |k, v|
          if "/#{path}" == "/tags/#{k}"
            nav "#{k} (#{v.length})", :'hashtag', "/tags/#{k}"
          else
            nav "#{k} (#{v.length})", :tag, "/tags/#{k}"
          end
        end
      end

    end

    instance_eval(&block)

    row do
      col 12 do
        hr
        br
        br

        text <<~TEXT
<script type="text/javascript" id="MathJax-script" async
  src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js">
</script>
        TEXT

        on_page_load <<~TEXT
          hljs.highlightAll();
        TEXT
      end
    end

  end


end

def post_collection_page(inf, posts, &block)

  mainpages = posts.each_slice(5).to_a

  mainpages.each_with_index do |postblok, i|
    postblok.each do |x|

      info = yield(i)

      create_page inf: inf, path: info[:path], title: info[:title] do

        header do
          col 12 do
            h2 info[:header]
          end
        end

        postblok.each do |post|

          row do
            col 12 do
              h1 do
                a post.title, href:"/#{post.page_path}"
              end

              h6 post.date.to_formatted_s(:long)

              text post.short_content

              a "Read post", href:"/#{post.page_path}"


              hr
            end
          end


        end

        row do
          col 12 do
            if i != 0
              a "<< previous" , href: "/#{yield(i-1)[:path]}"
            end

            if mainpages[i+1]
              a "next >>", href: "/#{yield(i+1)[:path]}", style: 'float: right;'
            end
          end
        end

      end
    end
  end

end