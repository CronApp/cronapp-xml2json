package cronapi.odata.server;

import org.eclipse.persistence.internal.jpa.deployment.PersistenceUnitProcessor;
import org.eclipse.persistence.internal.jpa.deployment.SEPersistenceUnitInfo;
import org.eclipse.persistence.jpa.Archive;
import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;
import org.springframework.boot.context.embedded.EmbeddedServletContainerCustomizer;
import org.springframework.boot.context.embedded.ServletContextInitializer;
import org.springframework.context.annotation.Configuration;

import javax.persistence.Persistence;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;
import java.util.List;
import java.util.Set;

@Configuration
public class OdataConfiguration implements ServletContextInitializer, EmbeddedServletContainerCustomizer {

  public static final String SERVICE_URL = "/api/cronapi/odata/v2/";

  @Override
  public void onStartup(ServletContext servletContext) throws ServletException {
    registerServlet(servletContext);
  }

  private void registerServlet(ServletContext servletContext) {

    Set<Archive> archives = PersistenceUnitProcessor.findPersistenceArchives();

    for (Archive archive : archives) {

      List<SEPersistenceUnitInfo> persistenceUnitInfos = PersistenceUnitProcessor.getPersistenceUnits(archive, Thread.currentThread().getContextClassLoader());

      for (SEPersistenceUnitInfo pui : persistenceUnitInfos) {

        String namespace = pui.getPersistenceUnitName();

        OdataServlet servlet = new OdataServlet(new JpaOdataServiceFactory(Persistence.createEntityManagerFactory(namespace), namespace));

        ServletRegistration.Dynamic serviceServlet = servletContext.addServlet("ServiceOData" + namespace, servlet);

        serviceServlet.addMapping(SERVICE_URL + namespace + "/*");
        serviceServlet.setAsyncSupported(true);
        serviceServlet.setLoadOnStartup(2);
      }
    }
  }

  @Override
  public void customize(ConfigurableEmbeddedServletContainer configurableEmbeddedServletContainer) {
  }
}
